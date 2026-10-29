import classNames from 'classnames';
import React from 'react';
import { ActionTooltip } from '../../actions/Actions/ActionTooltip';
import { useTranslation } from '../../i18n';
import RawButton from '../../semantic/RawButton';
import { mouseHoverProps } from '../../utils/mouseHoverProps';
import { toggleActionId, toggleIcon } from './toggle';

export type SplitPaneRailProps = {
  /**
   * The side of the secondary pane. The rail takes its place. The side also
   * sets the icon and the side of the tooltip.
   */
  side: 'left' | 'right';
  /**
   * The state of the secondary pane. "collapsed": the pane is hidden.
   * "peek": the pointer on the rail shows the pane over the page for a
   * moment. "open": the pane shows over the page in overlay mode.
   * @default "collapsed"
   */
  state?: 'collapsed' | 'peek' | 'open';
  /**
   * Puts the icon (with its tooltip) in an element of the app, for example a
   * spotlight that tells the user about the toggle.
   */
  wrapIcon?: (icon: React.ReactElement) => React.ReactNode;
  /** Runs on a click on the rail */
  onClick?: () => void;
  /** Runs when a pointer button goes down on the rail */
  onPointerDown?: (event: React.PointerEvent) => void;
  /** Runs when the mouse goes on the rail (`true`) and off it (`false`) */
  onHoverChange?: (hovered: boolean) => void;
};

const LABELS = {
  collapsed: 'sidebar.show',
  peek: 'sidebar.keepOpen',
  open: 'sidebar.hide',
} as const;

/**
 * The rail of a collapsed secondary pane: a narrow button that opens the
 * pane. `SplitPane` renders it. The product scenes render it alone, as the
 * picture at rest of a collapsed pane (`ui-public/SplitPane/Rail`).
 */
const Rail = React.forwardRef<HTMLButtonElement, SplitPaneRailProps>(
  function Rail(
    {
      side,
      state = 'collapsed',
      wrapIcon,
      onClick,
      onPointerDown,
      onHoverChange,
    },
    ref,
  ) {
    const { t } = useTranslation();
    const label = LABELS[state];
    const Icon = toggleIcon(side, state === 'open');

    // The tooltip and the spotlight go around the icon, not around the rail:
    // the rail is as tall as the page, and the wrapper of the spotlight is an
    // inline element, while the rail must fill the pane.
    const icon = (
      <ActionTooltip
        action={toggleActionId(side)}
        label={{ id: label }}
        placement={side === 'left' ? 'right' : 'left'}
      >
        <span className="SplitPane__rail__icon">
          <Icon />
        </span>
      </ActionTooltip>
    );

    return (
      <RawButton
        ref={ref}
        className={classNames(
          'SplitPane__rail',
          `SplitPane__rail--${side}`,
          state !== 'collapsed' && 'SplitPane__rail--active',
        )}
        ariaLabel={t(label)}
        expandable={{ open: state === 'open' }}
        onClick={onClick}
        onPointerDown={onPointerDown}
        {...(onHoverChange ? mouseHoverProps(onHoverChange) : {})}
      >
        {wrapIcon ? wrapIcon(icon) : icon}
      </RawButton>
    );
  },
);

export default Rail;
