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
 * @example Semantic color token CSS variables
 *
 * Inside `Canvas`, the host exposes a full semantic color palette as CSS
 * custom properties. Components should reference these tokens directly —
 * they adapt to the user's active theme (including dark mode)
 * automatically.
 *
 * ### How to read a token name
 *
 * ```
 * --color--{property}                 // standalone (one -- after color)
 * --color--{context}--{property}      // context pair (two -- after color)
 * ```
 *
 * **Properties** — `surface` (backgrounds), `ink` (text/icons),
 * `border` (1px lines), `outline` (focus rings), plus `fill` / `track`
 * for progress bars.
 *
 * **Standalone** tokens work on any neutral page. **Contexts** are
 * self-contained environments: always pair a `surface` with the `ink`,
 * `border`, and hover states from the *same* context. Never mix — e.g.
 * don't put `--color--primary--ink` on `--color--danger--surface`.
 *
 * Non-color tokens `--shadow--raised` / `--shadow--floating` /
 * `--shadow--lifted` / `--shadow--ambient` are ready-made `box-shadow`
 * composites.
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Section title="Standalone — use on any neutral page">
 *     <table><tbody>
 *       {[
 *         ['--color--surface',          'Default page background'],
 *         ['--color--surface-hover',    'Hovered row / list item'],
 *         ['--color--surface-muted',    'Muted section / card background'],
 *         ['--color--ink',              'Primary text'],
 *         ['--color--ink-subtle',       'Secondary text / captions'],
 *         ['--color--ink-hover',        'Text under hover'],
 *         ['--color--ink-muted',        'De-emphasized text'],
 *         ['--color--ink-placeholder',  'Input placeholder text'],
 *         ['--color--ink-primary',      'Brand-highlighted text / icons'],
 *         ['--color--ink-accent',       'Links / accent text'],
 *         ['--color--ink-disabled',     'Disabled text'],
 *         ['--color--border',           'Default 1px border'],
 *         ['--color--border-hover',     'Border under hover'],
 *       ].map(([t, d]) => (
 *         <tr key={t}>
 *           <td><code>{t}</code></td>
 *           <td style={{ color: 'var(--color--ink-subtle)' }}>{d}</td>
 *           <td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td>
 *         </tr>
 *       ))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Context: raised — modals, dropdowns, popovers">
 *     <table><tbody>
 *       {['--color--raised--surface', '--color--raised--surface-hover', '--color--raised--surface-active']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Context: primary — main call-to-action buttons, badges, nav">
 *     <table><tbody>
 *       {['--color--primary--surface', '--color--primary--surface-hover', '--color--primary--surface-active', '--color--primary--surface-muted', '--color--primary--ink', '--color--primary--border']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Context: tinted — subtle brand-tinted surfaces">
 *     <table><tbody>
 *       {['--color--tinted--surface', '--color--tinted--surface-hover', '--color--tinted--surface-active', '--color--tinted--ink', '--color--tinted--border']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Context: accent, selected, disabled, danger">
 *     <table><tbody>
 *       {['--color--accent--surface', '--color--accent--ink',
 *         '--color--selected--surface', '--color--selected--ink', '--color--selected--border',
 *         '--color--disabled--surface', '--color--disabled--ink',
 *         '--color--danger--surface', '--color--danger--ink']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Context: focus — focus rings and outlines">
 *     <table><tbody>
 *       {['--color--focus--border', '--color--focus--outline']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Feedback — validation and form states">
 *     <table><tbody>
 *       {['--color--feedback-fail--ink', '--color--feedback-fail--border', '--color--feedback-fail--outline', '--color--feedback-fail--surface',
 *         '--color--feedback-warning--ink', '--color--feedback-warning--border', '--color--feedback-warning--outline', '--color--feedback-warning--surface',
 *         '--color--feedback-success--ink', '--color--feedback-success--border', '--color--feedback-success--outline', '--color--feedback-success--surface']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Context: highlight — rich text inline highlights">
 *     <table><tbody>
 *       {['--color--highlight--surface']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Diffs — content versioning (added / removed / changed)">
 *     <table><tbody>
 *       {['--color--diff-added--surface', '--color--diff-added--outline', '--color--diff-added--ink', '--color--diff-added--ink-subtle',
 *         '--color--diff-removed--surface', '--color--diff-removed--outline', '--color--diff-removed--ink', '--color--diff-removed--ink-subtle',
 *         '--color--diff-changed--surface', '--color--diff-changed--outline']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Status — publishing workflow badges (ink-only)">
 *     <table><tbody>
 *       {['--color--status-draft--ink', '--color--status-outdated--ink', '--color--status-published--ink']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td><span style={{ color: `var(${t})`, fontWeight: 'bold' }}>Sample text</span></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Backdrop & overlay — scrims and floating UI">
 *     <table><tbody>
 *       {['--color--backdrop--surface', '--color--backdrop--ink',
 *         '--color--overlay--surface', '--color--overlay--surface-hover', '--color--overlay--surface-active', '--color--overlay--ink']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Stacked — dark layered UI (uploaders, media players)">
 *     <p>Stacked gives you layered dark surfaces (base → upper) plus action buttons, borders and ink tones. Use it when a dark inline panel needs internal hierarchy.</p>
 *     <table><tbody>
 *       {['--color--stacked--surface', '--color--stacked--surface-upper',
 *         '--color--stacked--surface-action', '--color--stacked--surface-action-hover', '--color--stacked--surface-action-active',
 *         '--color--stacked--ink', '--color--stacked--ink-subtle', '--color--stacked--border']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Progress — bar track and fill">
 *     <table><tbody>
 *       {['--color--progress--track', '--color--progress--fill', '--color--progress--fill-hover']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Tooltip — small dark floating labels">
 *     <table><tbody>
 *       {['--color--tooltip--surface', '--color--tooltip--surface-hover', '--color--tooltip--ink', '--color--tooltip--ink-subtle']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Code — dark code blocks, logs, error traces">
 *     <table><tbody>
 *       {['--color--code--surface', '--color--code--ink']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Scrollbar">
 *     <table><tbody>
 *       {['--color--scrollbar--fill']
 *         .map((t) => (<tr key={t}><td><code>{t}</code></td><td width="40"><div style={{ width: '30px', height: '30px', background: `var(${t})`, border: '1px solid var(--color--border)' }} /></td></tr>))}
 *     </tbody></table>
 *   </Section>
 *
 *   <Section title="Shadow composites — drop-in box-shadow values">
 *     <div style={{ display: 'flex', gap: 'var(--spacing-l)', padding: 'var(--spacing-l)' }}>
 *       {['--shadow--raised', '--shadow--floating', '--shadow--lifted', '--shadow--ambient'].map((t) => (
 *         <div key={t} style={{ textAlign: 'center' }}>
 *           <div style={{ width: '80px', height: '80px', background: 'var(--color--surface)', borderRadius: '4px', boxShadow: `var(${t})` }} />
 *           <code style={{ display: 'block', marginTop: 'var(--spacing-s)', fontSize: 'var(--font-size-xs)' }}>{t}</code>
 *         </div>
 *       ))}
 *     </div>
 *   </Section>
 * </Canvas>;
 * ```
 *
 * @example Typography CSS variables
 *
 * Typography is a foundational element in UI design. Good typography
 * establishes a strong, cohesive visual hierarchy and presents content clearly
 * and efficiently to users. Within the `Canvas` component, a set of CSS
 * variables is available allowing your plugin to conform to the overall
 * look&feel of DatoCMS:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <table>
 *     <tbody>
 *       <tr>
 *         <td>
 *           <code>--font-size-xxs</code>
 *         </td>
 *         <td>
 *           <div style={{ fontSize: 'var(--font-size-xxs)' }}>
 *             Size XXS
 *           </div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-xs</code>
 *         </td>
 *         <td>
 *           <div style={{ fontSize: 'var(--font-size-xs)' }}>Size XS</div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-s</code>
 *         </td>
 *         <td>
 *           <div style={{ fontSize: 'var(--font-size-s)' }}>Size S</div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-m</code>
 *         </td>
 *         <td>
 *           <div style={{ fontSize: 'var(--font-size-m)' }}>Size M</div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-l</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               fontSize: 'var(--font-size-l)',
 *               fontWeight: 'var(--font-weight-bold)',
 *             }}
 *           >
 *             Size L
 *           </div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-xl</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               fontSize: 'var(--font-size-xl)',
 *               fontWeight: 'var(--font-weight-bold)',
 *             }}
 *           >
 *             Size XL
 *           </div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-xxl</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               fontSize: 'var(--font-size-xxl)',
 *               fontWeight: 'var(--font-weight-bold)',
 *             }}
 *           >
 *             Size XXL
 *           </div>
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--font-size-xxxl</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               fontSize: 'var(--font-size-xxxl)',
 *               fontWeight: 'var(--font-weight-bold)',
 *             }}
 *           >
 *             Size XXXL
 *           </div>
 *         </td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </Canvas>;
 * ```
 *
 * @example Spacing CSS variables
 *
 * The following CSS variables are available as well, to mimick the spacing
 * between elements used by the main DatoCMS application. Negative spacing
 * variables are available too (`--negative-spacing-<SIZE>`).
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <table>
 *     <tbody>
 *       <tr>
 *         <td>
 *           <code>--spacing-s</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               background: 'var(--color--accent--surface)',
 *               width: 'var(--spacing-s)',
 *               height: 'var(--spacing-s)',
 *             }}
 *           />
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--spacing-m</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               background: 'var(--color--accent--surface)',
 *               width: 'var(--spacing-m)',
 *               height: 'var(--spacing-m)',
 *             }}
 *           />
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--spacing-l</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               background: 'var(--color--accent--surface)',
 *               width: 'var(--spacing-l)',
 *               height: 'var(--spacing-l)',
 *             }}
 *           />
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--spacing-xl</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               background: 'var(--color--accent--surface)',
 *               width: 'var(--spacing-xl)',
 *               height: 'var(--spacing-xl)',
 *             }}
 *           />
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--spacing-xxl</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               background: 'var(--color--accent--surface)',
 *               width: 'var(--spacing-xxl)',
 *               height: 'var(--spacing-xxl)',
 *             }}
 *           />
 *         </td>
 *       </tr>
 *       <tr>
 *         <td>
 *           <code>--spacing-xxxl</code>
 *         </td>
 *         <td>
 *           <div
 *             style={{
 *               background: 'var(--color--accent--surface)',
 *               width: 'var(--spacing-xxxl)',
 *               height: 'var(--spacing-xxxl)',
 *             }}
 *           />
 *         </td>
 *       </tr>
 *     </tbody>
 *   </table>
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
