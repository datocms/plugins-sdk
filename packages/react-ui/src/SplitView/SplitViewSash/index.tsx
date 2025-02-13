import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import s from './styles.module.css.json';

export type SashAction = {
  icon: ReactNode;
  onClick: () => void;
};

type SplitViewSashProps = {
  className?: string;
  style: React.CSSProperties;
  split: 'vertical' | 'horizontal';
  allowResize?: boolean;
  action?: SashAction;
  onMouseDown: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  onMouseUp: () => void;
};

export function SplitViewSash({
  onMouseDown,
  onMouseMove,
  onMouseUp,
  style,
  split,
  allowResize,
  action,
}: SplitViewSashProps) {
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

  const actionEl = action?.icon && (
    <div
      className={s.SplitViewSash__content}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={() => {
        action.onClick();
      }}
    >
      <div className={s.SplitViewSash__content__button}>{action?.icon}</div>
    </div>
  );

  return (
    <div
      role="Resizer"
      className={classNames(
        s.SplitViewSash,
        split === 'vertical'
          ? s['SplitViewSash--vertical']
          : s['SplitViewSash--horizontal'],
        !allowResize && s['SplitViewSash--no-resize'],
        dragging && s['SplitViewSash--dragging'],
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
      {actionEl}
    </div>
  );
}
