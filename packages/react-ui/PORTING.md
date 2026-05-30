# Porting CMS UI components into `datocms-react-ui`

This guide explains **whether** a component from the DatoCMS app (`dato/cms`, under
`src/components/ui/`) belongs in this package, and **how** to port it so it matches the
conventions already established here.

It is derived from how the existing components were actually ported. Where a rule is
illustrated by an existing component, the CMS original and the react-ui result are both
named so you can read the diff yourself.

> **North star:** `datocms-react-ui` gives plugin authors the *chrome vocabulary* of the
> DatoCMS interface — the structural, navigational, action, and feedback surfaces — so a
> plugin looks and behaves natively. It is **not** a port of the CMS's data-bound editing
> stack. We keep the *look and the interaction*, and throw away the CMS's data model,
> form framework, routing, i18n, and global state.

---

## Part 1 — Should this component be ported?

### 1.1 The one-line test

> Port it if a plugin author building a **generic UI inside a Canvas** would reach for it,
> and it can be expressed without the DatoCMS data model.

"Chrome" = page layout, toolbars, navigation, tabs, modals/overlays/popovers, dropdown
menus, empty states, status indicators/badges, buttons, generic form controls, spinners,
tooltips, panels, split views.

### 1.2 Coupling is a *cost*, not a veto

The most important rule, and the easiest to get wrong: **do not reject a vital chrome
component just because it imports `react-router`, `Formik`, redux, or i18n.** Those are
implementation details we strip during the port (see Part 2.3). A toolbar is vital chrome
even though the CMS toolbar's buttons call `history.push`. Judge by **importance to plugin
UIs**, then pay the decoupling cost.

The only true vetoes are **semantic**, not technical:

| Reject when the component is fundamentally about… | Examples (do **not** port) |
|---|---|
| A DatoCMS **data model** entity (records, fields, item types, uploads, users, environments, roles) | `BasicItemPresentation`, `ItemType*`, `Upload*`, `MediaCard`, `Avatar`, `Username`, `EnvironmentBadge`*, `ValidityTriangle` |
| The CMS **editing framework** itself (the structured-text editor, field arrays, the item form) | `form/SlateInput/**`, `form/RawField`, `form/FieldArray`, most of `form/*Input` |
| Functionality the **host already exposes via `ctx`** | `Notifications` (`ctx.notice`/`alert`), `Confirm` (`ctx.openConfirm`), host-level `openModal` |
| A one-off **internal app screen** | `Overview`, `Spotlight`, `PermissionDenied`, `UiStatus` |

\* `EnvironmentBadge` is a reject, but the generic **`Badge`** underneath it is a *keep* —
extract the primitive, drop the environment binding. This "extract the generic core" move
is common; see Part 2.7.

### 1.3 Decision checklist

1. **Is it chrome?** (layout / action / nav / feedback / generic control) → continue.
   Otherwise stop.
2. **Strip away its CMS data binding in your head.** Is there still a useful, generic
   component left? → continue. If nothing meaningful remains, stop.
3. **Does the host already provide it via `ctx`?** → stop (document the `ctx` API instead).
4. **Does react-ui already have it?** → consider *enriching* the existing component rather
   than adding a new one (e.g. the toolbar sub-components belong on the existing
   `Toolbar`, not a parallel component).
5. Otherwise: **port it.** Proceed to Part 2.

### 1.4 "Already exists — enrich instead of port"

These already live here; new work should extend them, not duplicate them: `Button`/
`ButtonLink`, `ButtonGroup`, `Canvas`, `Dropdown`, `Form` + `Field*`/`FormLabel`,
`HotKey`, `Section`, `SelectField`/`SelectInput`, `SidebarPanel`, `Spinner`, `SplitView`,
`SwitchField`/`SwitchInput`, `TextField`/`TextInput`, `TextareaField`/`TextareaInput`,
`Toolbar` (skeleton only — `Toolbar`/`ToolbarStack`/`ToolbarTitle`/`ToolbarButton`),
`Tooltip`, `VerticalSplit`.

---

## Part 2 — How to port

> **Design the API against real plugin usage — then normalize.** Before fixing a
> component's signature, look at how the *official plugins* actually use the equivalent UI
> (`/Users/stefanoverna/dato/plugins`). Those real-world call sites are the ground truth for
> what props and shapes a plugin author needs. **But "they use it" is not "we must support
> it."** Now that the SDK offers an *official* component, the plugin is often the thing that
> should be normalized toward a single standard way — not the component bent to absorb every
> ad-hoc variation. For each usage you find, decide deliberately: is this a genuine need the
> API must cover, or a one-off the plugin should be migrated to the standard surface?
> Evaluate carefully; don't invent props to paper over a non-standard call site, and don't
> blindly inherit the CMS's shape either. The goal is the *smallest* API that cleanly covers
> the legitimate real usages.

### 2.0 Mechanics & file layout

One component family per directory under `src/`:

```
src/MyComponent/
  index.tsx            // implementation, named export(s)
  styles.module.css    // scoped styles
```

Then:

- Components import the **generated JSON mapping**, never the CSS directly:
  `import s from './styles.module.css.json';` (the `.json` is produced by the
  `generate-cssmodules` build step — see `CLAUDE.md`).
- Re-export from `src/index.ts`.
- If you add a new CSS module, add it to `src/global.css` so it lands in the bundled
  `styles.css`.
- **Named exports, not default.** CMS uses `export default`; react-ui uses
  `export function Button(...)`. A file may export several related symbols
  (`Button` + `ButtonLink`, `SwitchInput` + types).

### 2.1 CSS: global BEM classes → scoped CSS Modules, tokens kept verbatim

CMS uses global class strings from shared SCSS; react-ui uses scoped module classes.

```tsx
// CMS                                  // react-ui
className="SwitchInput__switch"   →     className={s.switchInput__switch}
'button button--primary'         →     cn(styles.button, styles[`buttonType-${buttonType}`])
```

**Keep every `var(--color--…)`, `var(--spacing-…)`, `var(--shadow--…)` token exactly as
written.** Those semantic tokens are injected at runtime by the host onto the Canvas root,
so copying them verbatim gives automatic light/dark parity with the CMS — this is *why*
ports look native for free. Do not hardcode hex values or re-derive colors.

### 2.2 Controlled-only, no internal form/dirty state

react-ui components are **pure controlled components**: state lives with the caller.
Drop any internal value tracking that exists to serve the CMS item form.

> `form/StringInput` keeps `focus`/`blur` refs and elaborate null-vs-empty coercion to
> avoid false "dirty" states in the item form. `TextInput` (react-ui) **drops all of it** —
> `onBlur` is a plain passthrough. Dirty-tracking is an ItemForm concern, not a generic
> input concern.

### 2.3 Decoupling checklist (the "cost" you pay)

Strip each of these and replace with a plain prop:

| CMS dependency | What to do |
|---|---|
| `form/RawField` `BaseInputComponentPropsField` (the `{id, value, disabled, name, onChange, onBlur}` discriminated union) | Replace with explicit, plain props. Don't import the union. |
| `Formik` (`useFormik*`), `GloballyDisabledContext` | Replace with `value`/`onChange`/`disabled`/`pending`/`onSubmit` props. |
| `ItemFormContext` / `useItemFormContext` (e.g. `localeDirection`) | Drop, or expose as an explicit prop if genuinely generic. |
| `react-router` (`useHistory`, `useLocation`, `<Link to=>`) | Replace navigation with `onClick` and/or an `href` variant. See `ButtonLink`. |
| `react-redux` / `ducks/*` / store queries | Drop. The data must come in via props. |
| `react-i18next` / `FormattedMessage` / `{ i18n: string }` message objects | Replace with `ReactNode` props/children. See 2.4. |
| `localStorage` / other global host state | Drop persistence; keep local `useState`. (`SidebarPanel` dropped its `localStorageKey` open/closed persistence.) |
| `@datocms/cma-client` types | Drop; if a shape is needed, define a minimal local type. |

### 2.4 i18n: message keys/objects → `ReactNode`

```tsx
// CMS SidebarPanel                         // react-ui SidebarPanel
title: { i18n: string } | ReactNode    →    title?: ReactNode
<FormattedMessage id={title.i18n} />   →    {title}
```

The author passes already-rendered content. No translation layer, no message catalogs.
(Same move: `Label`'s `FormattedMessage` → `FormLabel`'s `children`; `BlankSlate`'s
`renderMessage(title)` → `ReactNode`.)

### 2.5 Prop naming & semantics conventions

These are the conventions the existing components follow — match them.

**a) `onChange` is value-first, with the event second.**

```ts
export type TextInputChangeEventHandler = (
  newValue: string,
  event: React.ChangeEvent<HTMLInputElement>,
) => void;
```

CMS passes only the value (`onChange?.(e.target.value)`); react-ui passes
`(newValue, event)` and **defines a named handler type** per component
(`TextInputChangeEventHandler`, `SwitchInputChangeEventHandler`). Booleans for switches:
`onChange(newValue: boolean, event)`.

**b) Spread the underlying native element's attributes, plus a `...rest` escape hatch.**

```ts
// TextInput
} & Omit<JSX.IntrinsicElements['input'], 'onChange'>;
// SwitchInput
extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'>
```

This makes components feel like enhanced DOM elements and gives authors an escape hatch
without us enumerating every prop.

**c) `error?: boolean` as a prop, not an external wrapper class.** CMS relies on an
ancestor `.form__field--invalid` class; react-ui takes `error` and toggles its own scoped
modifier (`TextInput`, `FormLabel`, `SelectInput`).

**d) Prefer enums over ambiguous booleans when it clarifies intent.**

```ts
// CMS Spinner            // react-ui Spinner
inline?: boolean    →     placement?: 'inline' | 'centered'
```

**e) Drop CMS-domain flags.** `treatFalseValueAsDeactivatedTrue`, `readOnly`, `localized`,
`renderDropdown`/`renderInfo` (Label) — none survive into react-ui. Keep the generic
surface only.

**f) Accessibility is upgraded during the port, not preserved.** `form/SwitchInput` is a
hidden `<input type="checkbox">` + `<label>`; react-ui's `SwitchInput` is a
`<button role="switch" aria-checked>` with `ArrowLeft`/`ArrowRight` keyboard handling.
When you re-implement, add roles/aria/keyboard. `TextInput` adds `labelText` → `aria-label`.

### 2.6 Naming: framework-neutral and clearer

| CMS | react-ui | Why |
|---|---|---|
| `StringInput` | `TextInput` | Plain DOM vocabulary, not the CMS field-type name |
| `form/SwitchInput` (with built-in label) | `SwitchInput` (bare) + `SwitchField` (labeled) | Input/Field split, see 2.7 |
| `Label` | `FormLabel` | Disambiguate from HTML `<label>` / data labels |
| global `button--*` classes / `SubmitButton` | `Button` + `ButtonLink` | A real component; `href` variant replaces router `Link` |
| `Toolbar.AddNewButton` (router) | `Toolbar` sub-component taking `onClick`/`href` | Decoupled action |

### 2.7 Two recurring structural moves

**a) Input (bare control) vs Field (labeled composite).** CMS often bakes the label into
the input and assembles the rest via `RawField`/`Field.tsx`. react-ui splits every form
control into two exported components:

- `XxxInput` — just the control (`value`, `onChange`, native attrs).
- `XxxField` — composes `XxxInput` + `FormLabel` + `FieldHint` + `FieldError`.

`XxxField` follows a fixed prop shape:

```ts
type SwitchFieldProps = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: SwitchInputProps['value'];
  onChange: SwitchInputProps['onChange'];
  switchInputProps?: SwitchInputProps;   // passthrough to the inner control
};
```

Note the `xxxInputProps` **passthrough object** and the reuse of the inner component's prop
types (`SwitchInputProps['value']`). Mirror this for any new field.

**b) Generalize to the visual/behavioral core.** When a CMS component is mostly
domain logic wrapped around a small presentational shell, **keep the shell, discard the
logic.**

> `form/FieldHint` in CMS is ~190 lines: validator introspection, `react-router`, date
> formatting, localization settings, i18n. react-ui's `FieldHint` is the shell that
> survived:
> ```tsx
> export function FieldHint({ children }: { children: ReactNode }) {
>   return <div className={s.fieldHint}>{children}</div>;
> }
> ```
> The validation logic was a CMS concern; the *look of a hint* was the chrome. Port the look.

### 2.8 Re-architecting against a standard library is allowed

A port doesn't have to mirror the CMS implementation — match the *behavior and look*, pick
the best implementation for a standalone library.

> CMS `Tooltip` is built on a bespoke `Overlay` + `usehooks-ts` `useHover` +
> `useDebounceOnBoolean`, using render-props / `cloneElement`. react-ui's `Tooltip` was
> **rebuilt on `@floating-ui/react`** (already a dependency) as a **compound component**
> (`TooltipTrigger` / `TooltipContent` / `TooltipDelayGroup`). Prefer compound components
> with a `Trigger`/`Content` shape for overlay-like UI over render-prop APIs.

### 2.9 Portals must re-enter the Canvas

Anything rendered through a portal (modal, tooltip, popover, overlay) escapes the Canvas
DOM subtree and therefore **loses the injected CSS custom properties**. Re-wrap portalled
content so the tokens are present again — react-ui's `Tooltip` renders its content inside a
`<Canvas>`/shared portal root for exactly this reason. Budget for this whenever you port
`Modal`/`Overlay`/`Popover` (and the `Portal`/`NewZIndex`/`useModalClose` helpers they need).

### 2.10 Document with a Canvas `@example`

Public components carry JSDoc `@example` blocks that render inside `<Canvas ctx={ctx}>`
(see `Button`, `SidebarPanel`, `Spinner`). These are extracted into `types.json` by
TypeDoc and power the docs site, so every exported component should have at least one
runnable example wrapped in a Canvas.

### 2.11 Modernize while you're in there

Ports drop dead/legacy code: react-ui `Spinner` removed the vendor-prefixed
`WebkitAnimationDelay`/`WebkitTransform` and the unused `...other` passthrough that the CMS
version carried. Don't faithfully copy cruft.

---

## Part 3 — Port checklist (paste into the PR)

**Decision**
- [ ] It's chrome, and a generic component survives stripping the CMS data model (Part 1.1–1.3)
- [ ] Not already provided by `ctx`; not a reject category (1.2)
- [ ] Not already in react-ui — or this PR *enriches* the existing one (1.4)

**Implementation**
- [ ] API checked against real usage in official plugins (`dato/plugins`); non-standard call sites flagged to normalize rather than props invented to absorb them (Part 2 preface)
- [ ] `src/MyComponent/{index.tsx,styles.module.css}`; imports `./styles.module.css.json`
- [ ] **Named** export(s); re-exported from `src/index.ts`; CSS added to `global.css`
- [ ] Global BEM classes → scoped module classes; **all semantic tokens kept verbatim** (2.1)
- [ ] Pure controlled; no Formik/RawField/ItemForm/router/redux/i18n/localStorage left (2.2–2.4)
- [ ] `onChange(newValue, event)` with a named handler type; native attrs spread + `...rest` (2.5a–b)
- [ ] `error?: boolean`; enums over ambiguous booleans; CMS-domain flags dropped (2.5c–e)
- [ ] a11y added (roles/aria/keyboard) (2.5f)
- [ ] Framework-neutral name; Input/Field split with `xxxInputProps` passthrough if a control (2.6–2.7a)
- [ ] Generalized to the presentational core; cruft removed (2.7b, 2.11)
- [ ] Portalled content re-wrapped in Canvas (2.9, if applicable)
- [ ] JSDoc `@example` in a `<Canvas ctx={ctx}>` (2.10)
- [ ] `npm run build` passes (regenerates css-module JSON, types, bundle)
</content>
</invoke>
