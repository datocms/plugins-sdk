import classNames from 'classnames';
import React, { type CSSProperties, type ReactNode } from 'react';
import s from './styles.module.css.json';

export type GroupProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * @example Basic example
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <ButtonGroup>
 *     <ButtonGroupButton>First</ButtonGroupButton>
 *     <ButtonGroupButton selected>Second</ButtonGroupButton>
 *     <ButtonGroupButton>Third</ButtonGroupButton>
 *     <ButtonGroupButton disabled>Fourth</ButtonGroupButton>
 *   </ButtonGroup>
 * </Canvas>;
 * ```
 */
export function Group({ children, style, className }: GroupProps): JSX.Element {
  return (
    <div className={classNames(s.Group, className)} style={style}>
      {children}
    </div>
  );
}
