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

# Every publishable workspace package, as "name version location" triples.
#
# Read off the filesystem rather than asked of npm: `npm query` resolves
# workspace locations through node_modules, which during a release rehearsal is
# a symlink to another checkout, so it answers with paths outside the copy you
# are actually rehearsing.
packages() {
  node -e '
    const fs = require("node:fs"), path = require("node:path");
    for (const pattern of require("./package.json").workspaces) {
      const dir = path.dirname(pattern);
      for (const entry of fs.readdirSync(dir).sort()) {
        const location = path.join(dir, entry);
        let pkg;
        try { pkg = JSON.parse(fs.readFileSync(path.join(location, "package.json"), "utf8")); } catch { continue; }
        if (pkg.private) continue;
        console.log(pkg.name, pkg.version, location);
      }
    }
  '
}
pending_changesets() { find .changeset -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' '; }

# The resume condition: at least one package whose local version is not yet on
# the registry. Checking a single package would be wrong — a release can die
# after publishing the first one.
unpublished() {
  local name ver loc missing=""
  while read -r name ver loc; do
    npm view "$name@$ver" version >/dev/null 2>&1 || missing="$missing $name@$ver"
  done < <(packages)
  echo "${missing# }"
}

# The packages this release covers, reconstructed after the fact: the ones whose
# current version has no `name@version` tag yet. Only the resume path needs this
# — a fresh release knows the answer exactly, by diffing the versions across the
# bump. It is deliberately generous: on the very first release under this tagging
# scheme *nothing* is tagged, so a resumed first release also re-announces
# packages that never moved. That costs a redundant GitHub release, once.
untagged_packages() {
  local name ver loc
  while read -r name ver loc; do
    # An `if` rather than `[ ... ] && echo`: under `set -e` an AND-list that
    # ends false is the loop body's exit status, so an already-tagged *last*
    # package would abort the whole script.
    if ! git rev-parse -q --verify "refs/tags/$name@$ver" >/dev/null; then
      echo "$name $ver $loc"
    fi
  done < <(packages)
}

# The section of a package's CHANGELOG for one version, without its "## x.y.z"
# heading — changesets has already written exactly the prose we want.
changelog_section() { # $1 = package location, $2 = version
  # A package that has never been released under changesets has no CHANGELOG.md
  # yet, and awk failing inside a `section="$(...)"` assignment would abort the
  # whole script under `set -e` — at the release notes, after npm and git.
  [ -f "$1/CHANGELOG.md" ] || return 0
  awk -v want="## $2" '$0 == want { found = 1; next } found && /^## / { exit } found' "$1/CHANGELOG.md"
}

# `release: v2.2.7` when everything moved together — which for a fixed group is
# every time — and the explicit list if the versions ever diverge.
commit_subject() { # $1 = "name version location" lines
  local versions
  versions="$(awk '{print $2}' <<<"$1" | sort -u)"
  if [ "$(wc -l <<<"$versions")" -eq 1 ]; then
    echo "release: v$versions"
  else
    awk '{ printf "%s%s@%s", sep, $1, $2; sep = ", " } END { print "" }' <<<"$1" | sed 's/^/release: /'
  fi
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

command -v gh >/dev/null 2>&1 || fail "the GitHub CLI is not installed, so the release notes can't be published."
gh auth status >/dev/null 2>&1 || fail "you are not logged in to GitHub. Run 'gh auth login'."

echo "on $BRANCH, in sync with origin, npm user: $(npm whoami)"

# ---------------------------------------------------------------------------
# Decide between a fresh release and resuming an interrupted one.
# ---------------------------------------------------------------------------
if [ "$(pending_changesets)" -eq 0 ]; then
  MISSING="$(unpublished)"
  [ -n "$MISSING" ] || fail "no pending changesets: there is nothing to release.
  Describe your changes with 'npx changeset' first."
  step "Resuming an interrupted release"
  echo "still missing from npm:$(printf ' %s' $MISSING)"
  RELEASING="$(untagged_packages)"
  [ -n "$RELEASING" ] || fail "every package is already tagged at its current version.
  A release that died after tagging cannot be resumed by this script: push the tags
  and create the missing GitHub releases by hand."
else
  BEFORE="$(packages)"

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

  # Read package by package rather than as a single "the version": in a linked
  # group only some of them move, and there is no one version to read.
  RELEASING="$(awk 'NR == FNR { was[$1] = $2; next } was[$1] != $2' <(echo "$BEFORE") <(packages))"
  [ -n "$RELEASING" ] || fail "changeset version did not bump anything."
  awk 'NR == FNR { was[$1] = $2; next }
       was[$1] != $2 { printf "  %s: %s -> %s\n", $1, (($1 in was) ? was[$1] : "new"), $2 }' \
    <(echo "$BEFORE") <(packages)

  [ -n "$(unpublished)" ] || fail "these versions are already on npm. Aborting before overwriting anything."

  step "Refreshing the lockfile"
  npm install --package-lock-only

  step "Committing the release"
  git add -A
  git commit -m "$(commit_subject "$RELEASING")"
fi

# ---------------------------------------------------------------------------
# The irreversible step, npm first.
# ---------------------------------------------------------------------------
step "Publishing to npm"
if [ -n "$DIST_TAG" ]; then
  npx changeset publish --no-git-tag --tag "$DIST_TAG"
else
  npx changeset publish --no-git-tag
fi

# ---------------------------------------------------------------------------
# git follows npm.
#
# `changeset git-tag` writes one annotated `name@version` tag per package,
# skipping any that already exist. We drive it rather than letting `changeset
# publish` tag inline (hence --no-git-tag above) only for the ordering: tagging
# after the publish keeps the property that matters, that a tag can only exist
# for a version which is actually on the registry.
# ---------------------------------------------------------------------------
step "Tagging"
npx changeset git-tag

step "Pushing to GitHub"
git push --follow-tags origin "$BRANCH"

# ---------------------------------------------------------------------------
# The release notes: one GitHub release per tag, its body the CHANGELOG section
# changesets just wrote. Last, because it's the only step a human can redo by
# hand from the changelog if it goes wrong.
# ---------------------------------------------------------------------------
step "Publishing the release notes"

while read -r name ver loc; do
  tag="$name@$ver"

  # A prerelease must not become the repo's "Latest release": that's reserved
  # for whatever is on the `latest` dist-tag. Decided per package, not once for
  # the run, so one prerelease version can't mark the others.
  PRERELEASE=""
  [ -z "$DIST_TAG" ] || PRERELEASE="--prerelease"
  case "$ver" in *-*) PRERELEASE="--prerelease" ;; esac

  if gh release view "$tag" >/dev/null 2>&1; then
    echo "$tag: the release already exists, leaving it alone"
    continue
  fi
  section="$(changelog_section "$loc" "$ver")"
  # A package released for the first time has no changelog entry to quote.
  [ -n "$section" ] || section="Released \`$tag\`."
  printf '%s\n' "$section" | \
    gh release create "$tag" --title "$tag" --verify-tag --notes-file - $PRERELEASE
done <<<"$RELEASING"

printf '\n\033[32mReleased\033[0m\n'
while read -r name ver loc; do
  printf '  %s@%s  %s\n' "$name" "$ver" \
    "$(gh release view "$name@$ver" --json url --jq .url 2>/dev/null || true)"
done <<<"$RELEASING"
