import React, { ReactNode, useEffect } from 'react';
import { RenderProperties, SizingUtilities } from 'datocms-plugin-sdk';
import styles from './styles.module.css.json';

function camelToDash(str: string) {
  if (str != str.toLowerCase()) {
    str = str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  }
  return str;
}

export type CanvasProps = {
  ctx: RenderProperties;
  noAutoResizer?: boolean;
  children: ReactNode;
};

/**
 * @example Color palette CSS variables
 *
 * Within the `Canvas` component, a color palette is made available as a set of
 * CSS variables, allowing you to conform to the theme of the current environment:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Section title="Text colors">
 *     <table>
 *       <tbody>
 *         <tr>
 *           <td>
 *             <code>--base-body-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--base-body-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--light-body-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--light-body-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--placeholder-body-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--placeholder-body-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *       </tbody>
 *     </table>
 *   </Section>
 *   <Section title="UI colors">
 *     <table>
 *       <tbody>
 *         <tr>
 *           <td>
 *             <code>--light-bg-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--light-bg-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--lighter-bg-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--lighter-bg-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--disabled-bg-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--disabled-bg-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--border-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--border-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--darker-border-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--darker-border-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--alert-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--alert-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--warning-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--warning-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--notice-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--notice-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--warning-bg-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--warning-bg-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--add-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--add-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--remove-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--remove-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *       </tbody>
 *     </table>
 *   </Section>
 *   <Section title="Project-specific colors">
 *     <table>
 *       <tbody>
 *         <tr>
 *           <td>
 *             <code>--accent-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--accent-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--primary-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--primary-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--light-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--light-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
 *         <tr>
 *           <td>
 *             <code>--dark-color</code>
 *           </td>
 *           <td width="30%">
 *             <div
 *               style={{
 *                 width: '30px',
 *                 height: '30px',
 *                 background: 'var(--dark-color)',
 *               }}
 *             />
 *           </td>
 *         </tr>
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
 *               background: 'var(--accent-color)',
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
 *               background: 'var(--accent-color)',
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
 *               background: 'var(--accent-color)',
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
 *               background: 'var(--accent-color)',
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
 *               background: 'var(--accent-color)',
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
 *               background: 'var(--accent-color)',
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
  const { mode } = (ctx as unknown) as { mode: string };

  useEffect(() => {
    if (mode !== 'renderPage' && !noAutoResizer) {
      const ctxWithAutoResizer = (ctx as unknown) as SizingUtilities;
      ctxWithAutoResizer.startAutoResizer();

      () => {
        ctxWithAutoResizer.stopAutoResizer();
      };
    }
  }, [mode, noAutoResizer]);

  const style = Object.entries(ctx.theme).reduce(
    (acc, [k, v]) => {
      return {
        ...acc,
        [`--${camelToDash(k)}`]: v,
        [`--${camelToDash(`${k}RgbComponents`)}`]:
          v.match(/rgb\((\d+, \d+, \d+)\)/)?.[1] || undefined,
      };
    },
    {
      padding: ctx.bodyPadding.map((p) => `${p}px`).join(' '),
    },
  );

  return (
    <div className={styles.canvas} style={style}>
      {children}
    </div>
  );
}
