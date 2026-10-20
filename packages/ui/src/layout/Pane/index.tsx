import classNames from 'classnames';
import React, { PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import Spinner from '../../feedback/Spinner';
import { useAutoincrementIntegerId } from '../../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import FormHeader from './FormHeader';
import { FilterBlankSlate } from './ListFilter';
import { PaneAriaLabelProvider } from './PaneAriaLabel';
import PaneHeader from './PaneHeader';
import { PaneTitleIdProvider } from './PaneTitleId';

export { useFilteredList } from './ListFilter';
export type {
  ListPreset,
  ListPresetOption,
  ListPresetsProps,
} from './ListPresets';
export { usePaneAriaLabel } from './PaneAriaLabel';

export type PaneProps = PropsWithChildren<{
  /**
   * The label of the parts of the pane that get none of their own (the
   * filter of the list, the pagination)
   * @example "Roles"
   */
  ariaLabel?: TextMessage;
  /** Only for the content of the pane, not for the look of the box */
  className?: string;
  /**
   * Shows a spinner on the pane while its content loads again (for example
   * the records of a list after a change of the filter)
   */
  busy?: boolean;
  /**
   * The fixed bar at the top: a Pane.Header, or a Toolbar. The pane draws a
   * line under each element of the slot (for example the toolbar and the
   * filter row under it).
   */
  header?: ReactNode;
  /**
   * A bar between the content and the footer, for the actions on the
   * selected items (a MultipleSelectionActionBar). The bar shows and hides
   * itself.
   */
  slideUpToolbar?: ReactNode;
  /**
   * Puts the pane in a mode (for example the reorder mode of a sidebar).
   * While the prop is set, the pane draws a primary frame around its
   * content, under the title bar. Thus the user sees that the pane is in
   * that mode. The title in the header is the name of the mode.
   *
   * For a screen reader, the content is then a group with the title as its
   * name. When the mode starts, the focus goes to the group. When the mode
   * stops and the focus has no element (the "Done" button goes away), the
   * focus goes to the content.
   */
  mode?: {
    /**
     * Stops the mode. It runs when the user pushes the pointer on the page
     * out of the pane. Menus and dialogs are not in the page: a click there
     * does not run it.
     */
    onExit: () => void;
  };
  /**
   * The fixed bar at the bottom (for example a Toolbar with the
   * pagination). The pane draws a line above each element of the slot.
   */
  footer?: ReactNode;
  /**
   * The content is the panel of tabs in the header (see Toolbar.Tabs): it
   * gets role="tabpanel", the id that the tabs control, and the id of the
   * active tab as its label.
   */
  tabPanel?: { id: string; labelledBy: string };
}>;

/**
 * A box with the full height of its place: a fixed header (a Pane.Header or
 * a Toolbar), a content that scrolls, and a fixed footer. Each page and each
 * side of a split is a Pane.
 */
function Pane({
  children,
  ariaLabel,
  className,
  busy,
  header,
  mode,
  slideUpToolbar,
  footer,
  tabPanel,
}: PaneProps) {
  const { tm } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = `pane-title-${useAutoincrementIntegerId()}`;
  const onExit = mode?.onExit;
  const inMode = Boolean(mode);
  const wasInMode = useRef(inMode);
  // True when a click out of the pane stops the mode. The focus then stays
  // where the user clicks, also on an element that cannot have the focus.
  const exitedByClickOutside = useRef(false);

  // A pane that starts in a mode does not take the focus: only a change of
  // the mode moves it.
  useEffect(() => {
    if (wasInMode.current === inMode) return;
    wasInMode.current = inMode;

    const clickedOutside = exitedByClickOutside.current;
    exitedByClickOutside.current = false;

    const content = contentRef.current;
    if (!content) return;

    const active = document.activeElement;
    const focusIsLost = !active || active === document.body;

    if (inMode || (focusIsLost && !clickedOutside)) {
      content.focus({ preventScroll: true });
    }
  }, [inMode]);

  useEffect(() => {
    if (!onExit) return;

    const handlePointerDown = (event: PointerEvent) => {
      const pane = ref.current;
      const target = event.target;

      if (!pane || !(target instanceof Node) || pane.contains(target)) {
        return;
      }

      // Menus, dialogs and tooltips are in portals: other children of the
      // body. Thus only a target in the same child of the body as the pane is
      // on the page.
      let page: HTMLElement = pane;
      while (page.parentElement && page.parentElement !== document.body) {
        page = page.parentElement;
      }

      if (page.contains(target)) {
        exitedByClickOutside.current = true;
        onExit();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [onExit]);

  return (
    <PaneAriaLabelProvider value={ariaLabel ? tm(ariaLabel) : ''}>
      <PaneTitleIdProvider value={titleId}>
        <div
          ref={ref}
          className={classNames('Pane', className, {
            'Pane--mode': mode,
          })}
        >
          {header && <div className={'Pane__header'}>{header}</div>}
          {busy && <Spinner.Overlay veil={false} className="Pane__overlay" />}
          <div
            ref={contentRef}
            className={'Pane__content'}
            role={tabPanel ? 'tabpanel' : mode ? 'group' : undefined}
            id={tabPanel?.id}
            aria-labelledby={
              tabPanel?.labelledBy ?? (mode ? titleId : undefined)
            }
            tabIndex={-1}
          >
            {children}
          </div>
          {slideUpToolbar && (
            <div className={'Pane__slideUpToolbar'}>{slideUpToolbar}</div>
          )}
          {footer && <div className={'Pane__footer'}>{footer}</div>}
        </div>
      </PaneTitleIdProvider>
    </PaneAriaLabelProvider>
  );
}

export default Object.assign(React.memo(Pane), {
  Header: PaneHeader,
  FormHeader,
  FilterBlankSlate,
});
