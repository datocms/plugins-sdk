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
 * Within the `Canvas` component, semantic color tokens are made available as
 * CSS variables, allowing you to conform to the theme of the current
 * environment (including dark mode):
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Section title="Standalone">
 *     <table>
 *       <tbody>
 *         {[
 *           '--color--surface',
 *           '--color--surface-hover',
 *           '--color--surface-muted',
 *           '--color--ink',
 *           '--color--ink-subtle',
 *           '--color--ink-placeholder',
 *           '--color--ink-accent',
 *           '--color--border',
 *           '--color--border-hover',
 *         ].map((v) => (
 *           <tr key={v}>
 *             <td><code>{v}</code></td>
 *             <td width="30%">
 *               <div style={{ width: '30px', height: '30px', background: `var(${v})` }} />
 *             </td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *   </Section>
 *   <Section title="Contexts">
 *     <table>
 *       <tbody>
 *         {[
 *           '--color--primary--surface',
 *           '--color--primary--ink',
 *           '--color--tinted--surface',
 *           '--color--tinted--ink',
 *           '--color--accent--surface',
 *           '--color--accent--ink',
 *           '--color--selected--surface',
 *           '--color--danger--surface',
 *           '--color--danger--ink',
 *           '--color--disabled--surface',
 *           '--color--disabled--ink',
 *           '--color--focus--border',
 *           '--color--focus--outline',
 *         ].map((v) => (
 *           <tr key={v}>
 *             <td><code>{v}</code></td>
 *             <td width="30%">
 *               <div style={{ width: '30px', height: '30px', background: `var(${v})` }} />
 *             </td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *   </Section>
 *   <Section title="Feedback">
 *     <table>
 *       <tbody>
 *         {[
 *           '--color--feedback-fail--ink',
 *           '--color--feedback-fail--border',
 *           '--color--feedback-warning--ink',
 *           '--color--feedback-warning--surface',
 *           '--color--feedback-success--ink',
 *           '--color--feedback-success--border',
 *         ].map((v) => (
 *           <tr key={v}>
 *             <td><code>{v}</code></td>
 *             <td width="30%">
 *               <div style={{ width: '30px', height: '30px', background: `var(${v})` }} />
 *             </td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
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
