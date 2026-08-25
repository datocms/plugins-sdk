#!/usr/bin/env bash
#
# Releases datocms-plugin-sdk and datocms-react-ui.
#
# The order of the steps below is the whole point: everything that can fail
# (network, tests, credentials) runs BEFORE anything irreversible happens, and
# the irreversible steps are ordered so that npm goes first and git follows.
#
# There is deliberately no rollback. `changeset publish` skips packages whose
# version is already on the registry, so if this script dies halfway through you
# recover by running it again: it notices that some package is still missing
# from npm and resumes the publish instead of starting a new release.

set -euo pipefail

cd "$(dirname "$0")/.."

DIST_TAG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --tag|--dist-tag) DIST_TAG="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[31mAborted: %s\033[0m\n' "$1" >&2; exit 1; }

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# Every workspace package, as "name version" pairs.
packages() {
  npm query .workspace --no-workspaces-update 2>/dev/null \
    | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{for(const p of JSON.parse(s))console.log(p.name,p.version)})'
}
version() { node -p "require('./packages/sdk/package.json').version"; }
pending_changesets() { find .changeset -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' '; }

# The resume condition: at least one package whose local version is not yet on
# the registry. Checking a single package would be wrong — a release can die
# after publishing the first one.
unpublished() {
  local name ver missing=""
  while read -r name ver; do
    npm view "$name@$ver" version >/dev/null 2>&1 || missing="$missing $name@$ver"
  done < <(packages)
  echo "${missing# }"
}

# ---------------------------------------------------------------------------
# Preflight: no mutations, just refuse to start from a state we can't finish.
# ---------------------------------------------------------------------------
step "Preflight"

# Normal releases happen on master. Prereleases are routinely cut from a feature
# branch, so --tag only asks that the branch be clean and pushed.
if [ -z "$DIST_TAG" ]; then
  [ "$BRANCH" = "master" ] || fail "you are not on master. Use --tag to publish a prerelease from a branch."
  [ ! -f .changeset/pre.json ] || fail "the repo is in changesets pre mode (.changeset/pre.json).
  Run 'npx changeset pre exit' before cutting a real release."
fi

[ -z "$(git status --porcelain)" ] || fail "working tree is dirty. Commit or stash first."

git fetch --quiet origin "$BRANCH"
[ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/$BRANCH")" ] || \
  fail "$BRANCH and origin/$BRANCH have diverged. Pull (or push) first."

npm whoami >/dev/null 2>&1 || fail "you are not logged in to npm. Run 'npm login'."

echo "on $BRANCH, in sync with origin, npm user: $(npm whoami)"

# ---------------------------------------------------------------------------
# Decide between a fresh release and resuming an interrupted one.
# ---------------------------------------------------------------------------
if [ "$(pending_changesets)" -eq 0 ]; then
  MISSING="$(unpublished)"
  [ -n "$MISSING" ] || fail "no pending changesets: there is nothing to release.
  Describe your changes with 'npx changeset' first."
  step "Resuming the interrupted release of v$(version)"
  echo "still missing from npm:$(printf ' %s' $MISSING)"
  RESUMING=1
else
  RESUMING=0
fi

if [ "$RESUMING" -eq 0 ]; then
  CURRENT="$(version)"

  # -------------------------------------------------------------------------
  # Everything that can fail. Nothing has been mutated yet, so a network
  # timeout here costs you nothing but the rerun.
  # -------------------------------------------------------------------------
  step "Building"
  npm run build

  step "Testing"
  npm test

  # -------------------------------------------------------------------------
  # Mutations, local only: bump, relock, commit.
  # Still nothing pushed, still nothing published.
  # -------------------------------------------------------------------------
  step "Applying pending changesets"
  npx changeset version

  NEXT="$(version)"
  [ "$NEXT" != "$CURRENT" ] || fail "changeset version did not bump anything."
  echo "$CURRENT -> $NEXT"

  [ -n "$(unpublished)" ] || fail "version $NEXT is already on npm. Aborting before overwriting anything."

  step "Refreshing the lockfile"
  npm install --package-lock-only

  step "Committing v$NEXT"
  git add -A
  git commit -m "v$NEXT"
fi

VERSION="$(version)"

# ---------------------------------------------------------------------------
# The irreversible step. npm first; changeset creates the git tags only for the
# packages it actually managed to publish.
# ---------------------------------------------------------------------------
step "Publishing v$VERSION to npm"
if [ -n "$DIST_TAG" ]; then
  npx changeset publish --tag "$DIST_TAG"
else
  npx changeset publish
fi

# ---------------------------------------------------------------------------
# git follows npm.
# ---------------------------------------------------------------------------
step "Pushing to GitHub"
git push --follow-tags origin "$BRANCH"

printf '\n\033[32mReleased v%s\033[0m\n' "$VERSION"
