import classNames from 'classnames';
import React, { type ReactNode, useState } from 'react';
import { CaretDownIcon, CaretUpIcon } from '../icons';
import s from './styles.module.css.json';

export type SidebarPanelProps = {
  title?: ReactNode;
  startOpen?: boolean;
  children: ReactNode;
  noPadding?: boolean;
};

/**
 * @example Basic example
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ display: 'flex' }}>
 *     <div
 *       style={{
 *         width: '300px',
 *         borderRight: '1px solid var(--color--border)',
 *       }}
 *     >
 *       <SidebarPanel title="Default">Content</SidebarPanel>
 *       <SidebarPanel title="Start open" startOpen>
 *         Content
 *       </SidebarPanel>
 *       <SidebarPanel title="Content with no padding" noPadding>
 *         Content
 *       </SidebarPanel>
 *     </div>
 *     <div
 *       style={{
 *         flex: '1',
 *         display: 'flex',
 *         justifyContent: 'center',
 *         alignItems: 'center',
 *         background: 'var(--color--surface-muted)',
 *       }}
 *     >
 *       Main content
 *     </div>
 *   </div>
 * </Canvas>;
 * ```
 */
export function SidebarPanel({
  startOpen = false,
  title,
  children,
  noPadding,
}: SidebarPanelProps): JSX.Element {
  const [open, setOpen] = useState(startOpen);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className={s.SidebarPanel}>
      {title && (
        <button
          type="button"
          className={s.SidebarPanel__header}
          onClick={handleToggle}
        >
          <div className={s.SidebarPanel__header__title}>{title}</div>
          <div className={s.SidebarPanel__header__chevron}>
            {open ? <CaretDownIcon /> : <CaretUpIcon />}
          </div>
        </button>
      )}
      {open && (
        <div
          className={classNames(s.SidebarPanel__content, {
            [s['SidebarPanel__content--no-padding']]: noPadding,
          })}
        >
          {children}
        </div>
      )}
    </div>
  );
}
