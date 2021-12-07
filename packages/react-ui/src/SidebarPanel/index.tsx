import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import s from './styles.module.css.json';

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width="1em"
      height="1em"
    >
      <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width="1em"
      height="1em"
    >
      <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
    </svg>
  );
}

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
 *         borderRight: '1px solid var(--border-color)',
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
 *         background: 'var(--light-bg-color)',
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
    <div className={s['SidebarPanel']}>
      {title && (
        <button
          type="button"
          className={s['SidebarPanel__header']}
          onClick={handleToggle}
        >
          <div className={s['SidebarPanel__header__title']}>{title}</div>
          <div className={s['SidebarPanel__header__chevron']}>
            {open ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </div>
        </button>
      )}
      {open && (
        <div
          className={classNames(s['SidebarPanel__content'], {
            [s['SidebarPanel__content--no-padding']]: noPadding,
          })}
        >
          {children}
        </div>
      )}
    </div>
  );
}
