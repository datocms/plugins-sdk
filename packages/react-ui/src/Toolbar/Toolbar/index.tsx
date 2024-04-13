import classNames from 'classnames';
import React, { type CSSProperties, type ReactNode } from 'react';
import s from './styles.module.css.json';

export type ToolbarProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * - @example Basic example
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Toolbar>
 *     <ToolbarStack stackSize="l">
 *       <ToolbarTitle>Media Area</ToolbarTitle>
 *     </ToolbarStack>
 *   </Toolbar>
 *   <div
 *     style={{
 *       display: 'flex',
 *       justifyContent: 'center',
 *       alignItems: 'center',
 *       background: 'var(--light-bg-color)',
 *       height: '150px',
 *     }}
 *   >
 *     Main content
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example Buttons and actions
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Toolbar>
 *     <ToolbarButton>
 *       <BackIcon />
 *     </ToolbarButton>
 *     <ToolbarStack stackSize="l">
 *       <ToolbarTitle>Media Area</ToolbarTitle>
 *       <div style={{ flex: '1' }} />
 *       <Button buttonType="primary">Action</Button>
 *     </ToolbarStack>
 *     <ToolbarButton>
 *       <SidebarLeftArrowIcon />
 *     </ToolbarButton>
 *   </Toolbar>
 *   <div
 *     style={{
 *       display: 'flex',
 *       justifyContent: 'center',
 *       alignItems: 'center',
 *       background: 'var(--light-bg-color)',
 *       height: '150px',
 *     }}
 *   >
 *     Main content
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example With button group
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Toolbar>
 *     <ToolbarStack stackSize="l">
 *       <ToolbarTitle>Media Area</ToolbarTitle>
 *       <div style={{ flex: '1' }} />
 *       <ButtonGroup>
 *         <ButtonGroupButton>First</ButtonGroupButton>
 *         <ButtonGroupButton selected>Second</ButtonGroupButton>
 *         <ButtonGroupButton>Third</ButtonGroupButton>
 *       </ButtonGroup>
 *     </ToolbarStack>
 *   </Toolbar>
 *   <div
 *     style={{
 *       display: 'flex',
 *       justifyContent: 'center',
 *       alignItems: 'center',
 *       background: 'var(--light-bg-color)',
 *       height: '150px',
 *     }}
 *   >
 *     Main content
 *   </div>
 * </Canvas>;
 * ```
 */
export function Toolbar({
  children,
  style,
  className,
}: ToolbarProps): JSX.Element {
  return (
    <div
      className={classNames(
        s.Toolbar,

        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
