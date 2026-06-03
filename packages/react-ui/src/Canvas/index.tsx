import classNames from 'classnames';
import type {
  ImposedSizePluginFrameCtx,
  SizingUtilities,
} from 'datocms-plugin-sdk';
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
} from 'react';
import { generateStyleFromCtx } from '../generateStyleFromCtx';
import s from './styles.module.css.json';

export type BaseCtx = ImposedSizePluginFrameCtx<any, {}, {}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CtxContext = createContext<BaseCtx | null>(null);

export function useCtx<T extends BaseCtx = BaseCtx>(): T {
  const ctx = useContext(CtxContext);

  if (!ctx) {
    throw new Error('useCtx requires <Canvas />!');
  }

  return ctx as T;
}

export type CanvasProps = {
  ctx: BaseCtx;
  noAutoResizer?: boolean;
  children: ReactNode;
};

/**
 * @example Colors
 *
 * A full semantic color palette is exposed inside `Canvas` as `--color--*` CSS variables.
 *
 * Regarding dark mode, `ctx.colorScheme` resolves to `'light'` or `'dark'`. The SDK runtime also sets `data-color-scheme` on `<html>` so selectors like `[data-color-scheme="dark"] {…}` work out of the box.
 *
 * #### Token name shape
 *
 * Tokens follow one of two name shapes:
 *
 * | Shape | Meaning |
 * | --- | --- |
 * | `--color--{property}` | standalone (one `--` after color) |
 * | `--color--{context}--{property}` | context pair (two `--` after color) |
 *
 * **Properties** are the role a color plays:
 *
 * | Property | Role |
 * | --- | --- |
 * | `surface` | backgrounds |
 * | `ink` | text and icons |
 * | `border` | 1px lines |
 * | `outline` | focus rings and block-level rings |
 * | `fill` / `track` | indicator fills and their backgrounds |
 *
 * **Standalone tokens** are for neutral page chrome; use them by default. Elevated neutral surfaces (modals, dropdowns, popovers) are standalone too, with hover and active variants for the raised layer. Pair them with the standalone ink tokens.
 *
 * **Context tokens** describe a self-contained mini-environment (a primary CTA, a danger button). Contexts come in two shapes:
 *
 * 1. **Ink-owning contexts**: signal contexts (primary, danger, accent, tinted, selected, feedback) and dark/inverted elevation contexts (overlay, backdrop, stacked, tooltip, code). Each defines an ink balanced on its own surface, so always pair surface and ink from the *same* context.
 * 2. **Single-property contexts**: focus (outline/border), progress (fill/track), highlight (surface), scrollbar (fill). Not surface+ink environments; the pairing rule doesn't apply.
 *
 * > [!WARNING] Never cross ink-owning contexts
 * > Don't put a primary ink on a danger surface, or an accent surface under a tinted ink. Each ink-owning context is contrast-balanced as a unit, and mixing produces illegible combinations, especially in dark mode.
 *
 * #### Defining custom colors
 *
 * Reserve custom colors for things genuinely outside the design system, such as brand illustrations, data-viz palettes, vendor-specific UI. Most needs ("primary button color", "error state") are already covered by tokens. When a custom color is justified, define it once per theme using the `[data-color-scheme="dark"]` selector that the SDK already sets:
 *
 * ```css
 * .my-plugin {
 *   --my-brand: #4a90e2;
 * }
 *
 * [data-color-scheme="dark"] .my-plugin {
 *   --my-brand: #6aa9ec;
 * }
 *
 * .my-plugin__cta {
 *   background: var(--my-brand);
 *   color: var(--color--primary--ink);
 * }
 * ```
 *
 * For non-CSS branching (image sources, third-party widget themes, syntax-highlighting presets), branch on `ctx.colorScheme` directly, e.g. `<img src={ctx.colorScheme === 'dark' ? logoDark : logoLight} />`. On modern browsers, the CSS `light-dark()` function is a more concise alternative to the per-theme variable pattern above.
 *
 * #### Available tokens
 *
 * A swatch for every available token, grouped by context.
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-l)' }}>
 *     <StateManager initial={true}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Standalone"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             One-level tokens that work on any neutral page. The <code>surface</code>, <code>ink</code> and <code>border</code> families cover the page background, body text and dividers; the <code>surface-raised</code> variants belong to the elevated layer used by modals, dropdowns and popovers. The tone-on-neutral inks (<code>ink-danger</code>, <code>ink-warning</code>, <code>ink-success</code>) color text and icons on a neutral surface; inside a toned panel use that context's own ink instead.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--surface', 'Page background everything else sits on'],
 *               ['--color--surface-hover', 'Hovered row inside lists and tables'],
 *               ['--color--surface-muted', 'Background of muted section panels and quiet cards'],
 *               ['--color--surface-raised', 'Elevated layer for modals, dropdowns and popovers'],
 *               ['--color--surface-raised-hover', 'Hovered option inside a dropdown menu'],
 *               ['--color--surface-raised-active', 'Focused or pressed option inside a dropdown menu'],
 *               ['--color--ink', 'Primary body text'],
 *               ['--color--ink-subtle', 'Secondary text, captions, helper labels'],
 *               ['--color--ink-hover', 'Toolbar icon and link fill on hover'],
 *               ['--color--ink-muted', 'Deemphasized text that should recede'],
 *               ['--color--ink-placeholder', 'Empty-input placeholder text'],
 *               ['--color--ink-primary', 'Theme-colored text and icons for branded labels'],
 *               ['--color--ink-link', 'Inline links and accent text'],
 *               ['--color--ink-danger', 'Error text or icon on a neutral surface'],
 *               ['--color--ink-warning', 'Warning text or icon on a neutral surface'],
 *               ['--color--ink-success', 'Success text or icon on a neutral surface'],
 *               ['--color--ink-disabled', 'Label color on disabled inputs and buttons'],
 *               ['--color--border', 'Default 1px divider between cards, rows and sections'],
 *               ['--color--border-hover', 'Border of an input or card when hovered'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: primary"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             The project's brand hue (the color the user picked for their DatoCMS project) at full strength. Reach for it on the main call-to-action button on a page, and on badges or navigation bars that need to stand out. The <code>surface-secondary</code> variant is a quieter brand surface step (for accent badges and inline action chips) that keeps the same white <code>ink</code>.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--primary--surface', 'Resting background of a primary call-to-action button'],
 *               ['--color--primary--surface-hover', 'Hovered primary button background'],
 *               ['--color--primary--surface-active', 'Pressed primary button background'],
 *               ['--color--primary--surface-muted', 'Muted variant of the primary surface'],
 *               ['--color--primary--surface-secondary', 'Quieter brand surface for accent badges and inline chips'],
 *               ['--color--primary--ink', 'Text and icon color sitting on any primary surface'],
 *               ['--color--primary--border', 'Thin border drawn on top of a primary surface'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: primary-soft"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             A soft panel in the same project brand hue: a pale brand surface paired with saturated brand ink. Quieter than primary, still clearly on-brand, for secondary actions, chips and tinted callouts.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--primary-soft--surface', 'Resting background of secondary brand-tinted buttons'],
 *               ['--color--primary-soft--surface-hover', 'Hovered tinted button background'],
 *               ['--color--primary-soft--surface-active', 'Pressed tinted button background'],
 *               ['--color--primary-soft--ink', 'Text and icon color on a soft brand surface'],
 *               ['--color--primary-soft--border', 'Thin border drawn on top of a soft brand surface'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: selected"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             The active selection state: the highlighted entry in a list or tree, the currently picked option in a radio or choice group, the chosen card in a gallery.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--selected--surface', 'Background of the currently active entry in a list or tree'],
 *               ['--color--selected--surface-hover', 'Hover on an entry that is already selected'],
 *               ['--color--selected--ink', 'Text and icon color inside the selected entry'],
 *               ['--color--selected--border', 'Border or outline ring drawn around a selected option or card'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: disabled"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             The flat, low-contrast pair applied to non-interactive controls: disabled buttons, disabled selects and disabled toggles.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--disabled--surface', 'Background of a disabled button or control'],
 *               ['--color--disabled--ink', 'Label and icon color on a disabled control'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: danger"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Reserved for destructive actions, such as Delete, Remove or Reset operations.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--danger--surface', 'Background of destructive action buttons like Delete'],
 *               ['--color--danger--ink', 'Text and icon color on a danger surface'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: focus"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             The keyboard-focus ring drawn around inputs, buttons and any other focusable control. Pair <code>border</code> on the element itself with <code>outline</code> as a soft halo.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--focus--border', 'Border color of the focused element'],
 *               ['--color--focus--outline', 'Soft outline ring drawn around the focused element'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Signal tones"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Soft panels for validation states and notifications: red for failures, amber for warnings, green for successes. Each <code>-soft</code> context is a pale surface paired with saturated ink, following the same four-property shape (surface, ink, border, outline), so you can swap the tone without touching layout. For a colored message on a plain neutral surface, reach for the standalone <code>ink-danger</code>, <code>ink-warning</code> and <code>ink-success</code> instead.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--danger-soft--surface', 'Background of error banners and alert toasts'],
 *               ['--color--danger-soft--ink', 'Error message text and the icon inside an error panel'],
 *               ['--color--danger-soft--border', 'Border around an invalid input or alert toast'],
 *               ['--color--danger-soft--outline', 'Soft halo around an invalid field on focus'],
 *               ['--color--warning-soft--surface', 'Background of warning banners and plugin notices'],
 *               ['--color--warning-soft--ink', 'Text inside warning banners and warning toasts'],
 *               ['--color--warning-soft--border', 'Border around warning banners and modified-state pills'],
 *               ['--color--warning-soft--outline', 'Soft halo for warning emphasis'],
 *               ['--color--success-soft--surface', 'Background of success toasts'],
 *               ['--color--success-soft--ink', 'Text inside success toasts and success banners'],
 *               ['--color--success-soft--border', 'Border around success banners'],
 *               ['--color--success-soft--outline', 'Soft halo for success emphasis'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Context: highlight"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             The yellow marker pen for inline rich-text highlights inside Structured Text editors.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--highlight--surface', 'Background of a highlighted span inside a rich text editor'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Diffs"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Content-versioning palette across three intents: green for added, red for removed, blue for changed. Inline text diffs use the surface tint; block-level revision panels use the outline. For positive/negative rule indicators, the left-border tone depends on whether the rule was just edited: a subtle ink when stable, a vivid one when freshly changed. The changed variant has no ink stops, since rule borders are only ever green or red.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--diff-added--surface', 'Background of inline added text inside a text diff'],
 *               ['--color--diff-added--outline', 'Outline drawn around a block-level added revision panel'],
 *               ['--color--diff-added--ink', 'Left-border color of a positive rule when it was recently changed (vivid)'],
 *               ['--color--diff-added--ink-subtle', 'Left-border color of a positive rule when it was not recently changed'],
 *               ['--color--diff-removed--surface', 'Background of inline removed text inside a text diff'],
 *               ['--color--diff-removed--outline', 'Outline drawn around a block-level removed revision panel'],
 *               ['--color--diff-removed--ink', 'Left-border color of a negative rule when it was recently changed (vivid)'],
 *               ['--color--diff-removed--ink-subtle', 'Left-border color of a negative rule when it was not recently changed'],
 *               ['--color--diff-changed--surface', 'Background of inline changed text inside a text diff'],
 *               ['--color--diff-changed--outline', 'Outline drawn around a block-level changed revision panel'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Status"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Publishing-workflow status dots. Ink-only because the colored dot is the whole marker, no surface or border needed.
 *           </p>
 *           <Swatches
 *             kind="text"
 *             tokens={[
 *               ['--color--status-draft--ink', 'Dot color for records that exist only as a draft'],
 *               ['--color--status-outdated--ink', 'Dot color for published records with unpublished changes'],
 *               ['--color--status-published--ink', 'Dot color for fully published records'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Backdrop and overlay"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Two scrims for two jobs. The backdrop is the full-screen dim painted behind a modal dialog. The overlay is the lighter scrim that sits on top of media or thumbnails and hosts reversed buttons designed to read against dark imagery.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--backdrop--surface', 'Full-screen dim behind modals and dialogs'],
 *               ['--color--backdrop--ink', 'Icon color for controls drawn directly on the backdrop, e.g. a modal close button'],
 *               ['--color--overlay--surface', 'Scrim painted over media thumbnails and image cards'],
 *               ['--color--overlay--surface-hover', 'Hover background of a reversed button floating on dark media'],
 *               ['--color--overlay--surface-active', 'Pressed background of a reversed button on dark media'],
 *               ['--color--overlay--ink', 'Text and icon color inside reversed buttons on overlay surfaces'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Stacked"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Layered dark inline areas, the kind used for asset uploaders and audio/video players. The wrapper paints the base surface; an inner detail panel sits a layer up; transparent action buttons gain visibility on hover and press.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--stacked--surface', 'Base layer of a dark inline panel'],
 *               ['--color--stacked--surface-upper', 'Inner detail panel sitting one layer above the base'],
 *               ['--color--stacked--surface-action', 'Resting background of action buttons inside a stacked panel (transparent)'],
 *               ['--color--stacked--surface-action-hover', 'Hovered action button inside a stacked panel'],
 *               ['--color--stacked--surface-action-active', 'Pressed action button inside a stacked panel'],
 *               ['--color--stacked--ink', 'Main text and values on a stacked surface'],
 *               ['--color--stacked--ink-subtle', 'Field labels and secondary text on a stacked surface'],
 *               ['--color--stacked--border', 'Column rules and dividers inside a stacked panel'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Progress"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Horizontal progress bars used to report quota usage, upload advancement and similar percentage indicators.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--progress--track', 'Empty portion of the bar (the background track)'],
 *               ['--color--progress--fill', 'Filled portion of the bar, drawn in the brand color'],
 *               ['--color--progress--fill-hover', 'Fill color when the bar is hovered'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Tooltip"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Small dark floating labels: the plain tooltip shown on hover, and the keyboard-hint variant that pairs a description with a keyboard shortcut.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--tooltip--surface', 'Background of standard and keyboard-hint tooltips'],
 *               ['--color--tooltip--surface-hover', 'Hover background for interactive controls living inside a tooltip'],
 *               ['--color--tooltip--ink', 'Primary text inside a tooltip'],
 *               ['--color--tooltip--ink-subtle', 'Secondary text inside a tooltip, e.g. the keyboard shortcut hint'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Code"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             The dark monospaced surface used by build logs, error traces and other terminal-style output.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--code--surface', 'Background of code blocks, log panes and error traces'],
 *               ['--color--code--ink', 'Monospaced text color rendered on a code surface'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Scrollbar"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Tint applied globally to the native scrollbar thumb. Most visible in Firefox and on systems that keep scrollbars always on.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--scrollbar--fill', 'Color of the native scrollbar thumb across the whole app'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *
 *     <StateManager initial={false}>
 *       {(isOpen, setOpen) => (
 *         <Section
 *           title="Field type groups"
 *           collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *         >
 *           <p>
 *             Fixed-hue soft chips for field type group icons. Each context exposes a <code>surface</code> (chip background) and an <code>ink</code> (icon fill). The hues are not brand-adaptive — they are fixed across projects and automatically flip between a pale surface with saturated ink in light mode and a deep surface with bright ink in dark mode.
 *           </p>
 *           <Swatches
 *             tokens={[
 *               ['--color--field-group-text--surface', 'Chip background for text/string/structured-text fields'],
 *               ['--color--field-group-text--ink', 'Icon fill for text/string/structured-text fields'],
 *               ['--color--field-group-rich-text--surface', 'Chip background for rich-text and single-block fields'],
 *               ['--color--field-group-rich-text--ink', 'Icon fill for rich-text and single-block fields'],
 *               ['--color--field-group-media--surface', 'Chip background for file, gallery and video fields'],
 *               ['--color--field-group-media--ink', 'Icon fill for file, gallery and video fields'],
 *               ['--color--field-group-datetime--surface', 'Chip background for date and date-time fields'],
 *               ['--color--field-group-datetime--ink', 'Icon fill for date and date-time fields'],
 *               ['--color--field-group-number--surface', 'Chip background for integer and float fields'],
 *               ['--color--field-group-number--ink', 'Icon fill for integer and float fields'],
 *               ['--color--field-group-boolean--surface', 'Chip background for boolean fields'],
 *               ['--color--field-group-boolean--ink', 'Icon fill for boolean fields'],
 *               ['--color--field-group-location--surface', 'Chip background for lat/lon fields'],
 *               ['--color--field-group-location--ink', 'Icon fill for lat/lon fields'],
 *               ['--color--field-group-color--surface', 'Chip background for color fields'],
 *               ['--color--field-group-color--ink', 'Icon fill for color fields'],
 *               ['--color--field-group-seo--surface', 'Chip background for slug and SEO fields'],
 *               ['--color--field-group-seo--ink', 'Icon fill for slug and SEO fields'],
 *               ['--color--field-group-reference--surface', 'Chip background for link and links fields'],
 *               ['--color--field-group-reference--ink', 'Icon fill for link and links fields'],
 *               ['--color--field-group-json--surface', 'Chip background for JSON fields'],
 *               ['--color--field-group-json--ink', 'Icon fill for JSON fields'],
 *             ]}
 *           />
 *         </Section>
 *       )}
 *     </StateManager>
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example Shadows
 *
 * Four ready-made `box-shadow` composites (raised, floating, lifted, ambient). Drop them straight into a `box-shadow` property.
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Swatches
 *     kind="shadow"
 *     tokens={['--shadow--raised', '--shadow--floating', '--shadow--lifted', '--shadow--ambient']}
 *   />
 * </Canvas>;
 * ```
 *
 * @example Typography
 *
 * Typography is a foundational element in UI design. Good typography establishes a strong, cohesive visual hierarchy and presents content clearly and efficiently to users. Within the `Canvas` component, a set of CSS variables is available allowing your plugin to conform to the overall look&feel of DatoCMS:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Swatches
 *     kind="font-size"
 *     tokens={[
 *       '--font-size-xxs',
 *       '--font-size-xs',
 *       '--font-size-s',
 *       '--font-size-m',
 *       '--font-size-l',
 *       '--font-size-xl',
 *       '--font-size-xxl',
 *       '--font-size-xxxl',
 *     ]}
 *   />
 * </Canvas>;
 * ```
 *
 * @example Spacing
 *
 * The following CSS variables are available as well, to mimick the spacing between elements used by the main DatoCMS application. Negative spacing variables are available too (`--negative-spacing-<SIZE>`).
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Spacings
 *     tokens={[
 *       '--spacing-s',
 *       '--spacing-m',
 *       '--spacing-l',
 *       '--spacing-xl',
 *       '--spacing-xxl',
 *       '--spacing-xxxl',
 *     ]}
 *   />
 * </Canvas>;
 * ```
 */

export function Canvas({
  ctx,
  children,
  noAutoResizer,
}: CanvasProps): JSX.Element {
  const { mode } = ctx as unknown as { mode: string };

  useEffect(() => {
    if (!noAutoResizer && 'startAutoResizer' in ctx) {
      const ctxWithAutoResizer = ctx as unknown as SizingUtilities;
      ctxWithAutoResizer.startAutoResizer();

      return () => {
        ctxWithAutoResizer.stopAutoResizer();
      };
    }

    return undefined;
  }, [mode, noAutoResizer]);

  // The semantic color tokens are only set on the canvas wrapper, so the page
  // itself (`html`/`body`, outside the wrapper) can't reference them. Mirror
  // the scrollbar token onto the document root so the page-level scrollbar can
  // be themed too (consumed by the layered `html` rule in `base.css`).
  const scrollbarFill = ctx.semanticColorTokensTheme['--color--scrollbar--fill'];

  useEffect(() => {
    if (typeof document === 'undefined' || !scrollbarFill) {
      return undefined;
    }

    const property = '--color--scrollbar--fill';
    const root = document.documentElement;
    const previous = root.style.getPropertyValue(property);
    root.style.setProperty(property, scrollbarFill);

    return () => {
      if (previous) {
        root.style.setProperty(property, previous);
      } else {
        root.style.removeProperty(property);
      }
    };
  }, [scrollbarFill]);

  return (
    <CtxContext.Provider value={ctx}>
      <div
        className={classNames(s.themeVariables, s.canvas)}
        style={generateStyleFromCtx(ctx)}
      >
        {children}
      </div>
    </CtxContext.Provider>
  );
}
