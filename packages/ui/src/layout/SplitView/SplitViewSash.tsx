import classNames from 'classnames';
import React, { ReactElement, ReactNode, useState } from 'react';
import type { TextMessage } from '../../Message';
import { SvgIcon } from '../../utils/types';
import SashActionButton from './SashActionButton';

export type SashAction = {
  icon: SvgIcon;
  // The accessible name and the tooltip of the button
  label: TextMessage;
  onClick: () => void;
  // See SashActionButton
  expandable?: { open: boolean };
  // Puts the button in an element of the app (for example a spotlight that
  // tells the user about the button)
  wrap?: (button: ReactElement) => ReactNode;
  // See SashActionButton
  hidden?: boolean;
  revealFrom?: 'left' | 'right';
  onHoverChange?: (isHovered: boolean) => void;
};

type Props = {
  className?: string;
  style: React.CSSProperties;
  split: 'vertical' | 'horizontal';
  allowResize?: boolean;
  action?: SashAction;
  onMouseDown: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  onMouseUp: () => void;
};

export default function SplitViewSash({
  onMouseDown,
  onMouseMove,
  onMouseUp,
  style,
  split,
  allowResize,
  action,
}: Props) {
  const [dragging, setDrag] = useState(false);

  function handleMouseMove(e: MouseEvent) {
    onMouseMove(e.pageX, e.pageY);
  }

  function handleMouseUp() {
    setDrag(false);
    onMouseUp();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  function handleTouchMove(e: TouchEvent) {
    onMouseMove(e.touches[0].pageX, e.touches[0].pageY);
  }

  function handleTouchEnd() {
    setDrag(false);
    onMouseUp();
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }

  const actionEl = action && (
    <SashActionButton
      icon={action.icon}
      label={action.label}
      onClick={action.onClick}
      expandable={action.expandable}
      revealFrom={action.revealFrom}
      hidden={action.hidden}
      onHoverChange={action.onHoverChange}
    />
  );

  return (
    <div
      className={classNames(
        'SplitViewSash',
        split === 'vertical'
          ? 'SplitViewSash--vertical'
          : 'SplitViewSash--horizontal',
        !allowResize && 'SplitViewSash--no-resize',
        dragging && 'SplitViewSash--dragging',
      )}
      onMouseDown={(e) => {
        setDrag(true);
        onMouseDown(e.pageX, e.pageY);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        setDrag(true);
        onMouseDown(e.touches[0].pageX, e.touches[0].pageY);

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
      }}
      style={style}
    >
      {action?.wrap && actionEl ? action.wrap(actionEl) : actionEl}
    </div>
  );
}
