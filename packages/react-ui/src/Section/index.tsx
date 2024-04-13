import cn from 'classnames';
import React, { type CSSProperties, type ReactNode } from 'react';
import s from './styles.module.css.json';

type SectionProps = {
  title: ReactNode;
  children?: ReactNode;
  highlighted?: boolean;
  collapsible?: { isOpen: boolean; onToggle: () => void };
  headerClassName?: string;
  titleClassName?: string;
  headerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
};

/**
 * @example Basic usage
 *
 * ```jsx
 * <Canvas ctx={ctx}>
 *   <Section title="Section title">
 *     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
 *     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *     aliquip ex ea commodo consequat.
 *   </Section>
 * </Canvas>;
 * ```
 *
 * @example Highlighted
 *
 * ```jsx
 * <Canvas ctx={ctx}>
 *   <Section title="Section title" highlighted>
 *     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
 *     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *     aliquip ex ea commodo consequat.
 *   </Section>
 * </Canvas>;
 * ```
 *
 * @example Collapsible
 *
 * ```jsx
 * <Canvas ctx={ctx}>
 *   <StateManager initial={true}>
 *     {(isOpen, setOpen) => (
 *       <Section
 *         title="Section title"
 *         collapsible={{ isOpen, onToggle: () => setOpen((v) => !v) }}
 *       >
 *         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *         eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
 *         enim ad minim veniam, quis nostrud exercitation ullamco laboris
 *         nisi ut aliquip ex ea commodo consequat.
 *       </Section>
 *     )}
 *   </StateManager>
 * </Canvas>;
 * ```
 */
export function Section({
  title,
  children,
  highlighted,
  collapsible,
  headerClassName,
  titleClassName,
  headerStyle,
  titleStyle,
}: SectionProps): JSX.Element {
  return (
    <div
      className={cn(s.Section, { [s['Section--highlighted']]: highlighted })}
    >
      <div
        className={cn(s.Section__header, headerClassName)}
        style={headerStyle}
      >
        <div
          className={cn(
            s.Section__title,

            titleClassName,
          )}
          style={titleStyle}
        >
          {collapsible && (
            <button
              type="button"
              className={cn(s.Section__arrow, {
                [s['Section__arrow--is-open']]: collapsible.isOpen,
              })}
              onClick={collapsible.onToggle}
            />
          )}
          <div className={s.Section__title__content}>{title}</div>
        </div>
      </div>
      {(!collapsible || collapsible.isOpen) && children}
    </div>
  );
}
