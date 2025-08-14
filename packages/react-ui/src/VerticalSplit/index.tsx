import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { SplitView } from '../SplitView';
import { SplitViewPane } from '../SplitView/SplitViewPane';
import sashS from '../SplitView/SplitViewSash/styles.module.css.json';
import { ChevronsLeftIcon, ChevronsRightIcon, SidebarFlipIcon } from '../icons';
import s from './styles.module.css.json';

const initialSidebarWidth = 220;

export type VerticalSplitProps = {
  mode?: 'overlay' | 'split';
  minSize?: number | string;
  maxSize?: number | string;
  size?: number | string;
  primaryPane: 'left' | 'right';
  isSecondaryCollapsed?: boolean;
  allowResize?: boolean;
  children: [React.ReactNode, React.ReactNode];
  onDragFinished?: (newSize: number) => void;
  onSecondaryToggle?: (secondaryExpanded: boolean) => void;
};

type Size = string | number;

function calculateSizes({
  size,
  primaryPane,
  isSecondaryCollapsed,
}: {
  size: number | string;
  primaryPane: 'left' | 'right';
  isSecondaryCollapsed?: boolean;
}): Size[] {
  const realSize = isSecondaryCollapsed ? 20 : size;
  return primaryPane === 'right' ? [realSize] : ['auto', realSize];
}

/**
 * @example Resizable, left primary panel
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ height: 500, position: 'relative' }}>
 *     <VerticalSplit primaryPane="left" size="25%" minSize={220}>
 *       <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
 *         <Toolbar>
 *           <ToolbarStack stackSize="l">
 *             <ToolbarTitle>Primary</ToolbarTitle>
 *           </ToolbarStack>
 *         </Toolbar>
 *         <div
 *           style={{
 *             flex: '1',
 *             display: 'flex',
 *             justifyContent: 'center',
 *             alignItems: 'center',
 *             height: '150px',
 *           }}
 *         >
 *           Main content
 *         </div>
 *       </div>
 *       <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-color)' }}>
 *         <Toolbar>
 *           <ToolbarStack stackSize="l">
 *             <ToolbarTitle>Secondary</ToolbarTitle>
 *           </ToolbarStack>
 *         </Toolbar>
 *         <div
 *           style={{
 *             flex: '1',
 *             display: 'flex',
 *             justifyContent: 'center',
 *             alignItems: 'center',
 *             height: '150px',
 *           }}
 *         >
 *           Sidebar
 *         </div>
 *       </div>
 *     </VerticalSplit>
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example Resizable, right primary panel
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ height: 500, position: 'relative' }}>
 *     <VerticalSplit primaryPane="right" size="25%" minSize={220}>
 *       <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
 *         <Toolbar>
 *           <ToolbarStack stackSize="l">
 *             <ToolbarTitle>Secondary</ToolbarTitle>
 *           </ToolbarStack>
 *         </Toolbar>
 *         <div
 *           style={{
 *             flex: '1',
 *             display: 'flex',
 *             justifyContent: 'center',
 *             alignItems: 'center',
 *             height: '150px',
 *           }}
 *         >
 *           Sidebar
 *         </div>
 *       </div>
 *       <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-color)' }}>
 *         <Toolbar>
 *           <ToolbarStack stackSize="l">
 *             <ToolbarTitle>Primary</ToolbarTitle>
 *           </ToolbarStack>
 *         </Toolbar>
 *         <div
 *           style={{
 *             flex: '1',
 *             display: 'flex',
 *             justifyContent: 'center',
 *             alignItems: 'center',
 *             height: '150px',
 *           }}
 *         >
 *           Main content
 *         </div>
 *       </div>
 *     </VerticalSplit>
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example Collapsible
 *
 * ```js
 *   <Canvas ctx={ctx}>
 *    <div style={{ height: 500, position: 'relative' }}>
 *      <StateManager initial={true}>
 *        {(isCollapsed, setCollapsed) => (
 *          <VerticalSplit
 *            primaryPane="left"
 *            size="25%"
 *            minSize={220}
 *            isSecondaryCollapsed={isCollapsed}
 *            onSecondaryToggle={setCollapsed}
 *          >
 *            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
 *              <Toolbar>
 *                <ToolbarStack stackSize="l">
 *                  <ToolbarTitle>Primary</ToolbarTitle>
 *                </ToolbarStack>
 *              </Toolbar>
 *              <div
 *                style={{
 *                  flex: '1',
 *                  display: 'flex',
 *                  justifyContent: 'center',
 *                  alignItems: 'center',
 *                  height: '150px',
 *                }}
 *              >
 *                Main content
 *              </div>
 *            </div>
 *            <div
 *              style={{
 *                display: 'flex',
 *                flexDirection: 'column',
 *                height: '100%',
 *                borderLeft: '1px solid var(--border-color)',
 *              }}
 *            >
 *              <Toolbar>
 *                <ToolbarStack stackSize="l">
 *                  <ToolbarTitle>Secondary</ToolbarTitle>
 *                </ToolbarStack>
 *              </Toolbar>
 *              <div
 *                style={{
 *                  flex: '1',
 *                  display: 'flex',
 *                  justifyContent: 'center',
 *                  alignItems: 'center',
 *                  height: '150px',
 *                }}
 *              >
 *                Sidebar
 *              </div>
 *            </div>
 *          </VerticalSplit>
 *        )}
 *      </StateManager>
 *    </div>
 *  </Canvas>;
 * ```
 *
 * @example Overlay mode
 *
 * ```js
 *   <Canvas ctx={ctx}>
 *    <div style={{ height: 500, position: 'relative' }}>
 *      <StateManager initial={true}>
 *        {(isCollapsed, setCollapsed) => (
 *          <VerticalSplit
 *            mode="overlay"
 *            primaryPane="left"
 *            size="25%"
 *            minSize={220}
 *            isSecondaryCollapsed={isCollapsed}
 *            onSecondaryToggle={setCollapsed}
 *          >
 *            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
 *              <Toolbar>
 *                <ToolbarStack stackSize="l">
 *                  <ToolbarTitle>Primary</ToolbarTitle>
 *                </ToolbarStack>
 *              </Toolbar>
 *              <div
 *                style={{
 *                  flex: '1',
 *                  display: 'flex',
 *                  justifyContent: 'center',
 *                  alignItems: 'center',
 *                  height: '150px',
 *                }}
 *              >
 *                Main content
 *              </div>
 *            </div>
 *            <div
 *              style={{
 *                display: 'flex',
 *                flexDirection: 'column',
 *                height: '100%',
 *                borderLeft: '1px solid var(--border-color)',
 *              }}
 *            >
 *              <Toolbar>
 *                <ToolbarStack stackSize="l">
 *                  <ToolbarTitle>Secondary</ToolbarTitle>
 *                </ToolbarStack>
 *              </Toolbar>
 *              <div
 *                style={{
 *                  flex: '1',
 *                  display: 'flex',
 *                  justifyContent: 'center',
 *                  alignItems: 'center',
 *                  height: '150px',
 *                }}
 *              >
 *                Sidebar
 *              </div>
 *            </div>
 *          </VerticalSplit>
 *        )}
 *      </StateManager>
 *    </div>
 *  </Canvas>;
 * ```
 */
export function VerticalSplit({
  mode = 'split',
  minSize = 200,
  maxSize,
  size = initialSidebarWidth,
  primaryPane,
  children,
  allowResize = true,
  onDragFinished,
  onSecondaryToggle,
  isSecondaryCollapsed,
}: VerticalSplitProps) {
  const [sizes, setSizes] = useState<Size[]>(
    calculateSizes({ size, primaryPane, isSecondaryCollapsed }),
  );
  const currentSizes = useRef<Size[]>(sizes);

  const SashActionIcon = onSecondaryToggle
    ? primaryPane === 'left'
      ? isSecondaryCollapsed
        ? SidebarFlipIcon
        : ChevronsRightIcon
      : isSecondaryCollapsed
        ? ChevronsRightIcon
        : ChevronsLeftIcon
    : undefined;

  useEffect(() => {
    setSizes(calculateSizes({ size, primaryPane, isSecondaryCollapsed }));
  }, [size, primaryPane, isSecondaryCollapsed]);

  function handleChange(newSizes: Size[]) {
    setSizes(newSizes);
    currentSizes.current = newSizes;
  }

  function handleDragEnd() {
    onDragFinished?.(currentSizes.current[0] as number);
  }

  function handleSecondaryClick() {
    onSecondaryToggle?.(!isSecondaryCollapsed);
  }

  function renderPane(pane: 'left' | 'right') {
    const isSecondaryPane = primaryPane !== pane;

    return (
      <SplitViewPane
        {...(isSecondaryPane && !isSecondaryCollapsed
          ? { minSize, maxSize }
          : {})}
      >
        {isSecondaryPane && isSecondaryCollapsed ? (
          <div
            className={classNames(
              s.VerticalSplitPane__expand,
              s[`VerticalSplitPane__expand--${pane}`],
            )}
            onClick={handleSecondaryClick}
          />
        ) : (
          children[pane === 'left' ? 0 : 1]
        )}
      </SplitViewPane>
    );
  }

  if (mode === 'overlay' && !isSecondaryCollapsed && SashActionIcon) {
    const primaryPaneChild = children[primaryPane === 'left' ? 0 : 1];
    const secondaryPaneChild = children[primaryPane === 'left' ? 1 : 0];

    return (
      <>
        <div
          className={s.VerticalSplitPaneOverlay}
          onClick={handleSecondaryClick}
        >
          <div
            className={classNames(
              s.VerticalSplitPaneOverlay__secondary,
              s[
                `VerticalSplitPaneOverlay__secondary--${
                  primaryPane === 'left' ? 'right' : 'left'
                }`
              ],
            )}
            style={{
              width: size,
              maxWidth: maxSize,
              minWidth: minSize,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {secondaryPaneChild}
            <div className={s.VerticalSplitPaneOverlay__sash}>
              <div
                className={sashS.SplitViewSash__content}
                onClick={handleSecondaryClick}
              >
                <div className={sashS.SplitViewSash__content__button}>
                  <SashActionIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            s.VerticalSplitPaneOverlay__primary,
            s[`VerticalSplitPaneOverlay__primary--${primaryPane}`],
          )}
        >
          {primaryPaneChild}
        </div>
      </>
    );
  }

  return (
    <SplitView
      allowResize={!isSecondaryCollapsed && allowResize}
      sizes={sizes}
      onChange={handleChange}
      onDragEnd={handleDragEnd}
      sashAction={
        SashActionIcon && {
          icon: <SashActionIcon />,
          onClick: handleSecondaryClick,
        }
      }
    >
      {renderPane('left')}
      {renderPane('right')}
    </SplitView>
  );
}
