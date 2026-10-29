import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type SpinnerProps = {
  /**
   * Makes a small spinner (16px, the size of an icon) for a line of text or
   * a control. Without it, the spinner is 32px and it is centered in its
   * parent, to load an area.
   * @default false
   */
  inline?: boolean;
  /**
   * The text that a screen reader tells: the spinner is a status. Give
   * `false` when a visible text or `aria-busy` already tells that the
   * content loads: then the spinner is only a decoration.
   * @default "Loading"
   */
  label?: TextMessage | false;
  /** Only for the place of the spinner (margin, z-index), not for its look */
  className?: string;
};

/**
 * A spinner that tells that something loads. It has two sizes: 32px to load
 * an area, 16px (an icon) in a line of text or in a control. The box is the
 * size of the spinner.
 */
function Spinner({
  inline,
  label = { id: 'spinner.label' },
  className: extraClassName,
}: SpinnerProps) {
  const { tm } = useTranslation();
  const size = inline ? 16 : 32;
  const className = ['Spinner'];

  if (inline) {
    className.push('Spinner--inline');
  } else {
    className.push('Spinner--centered');
  }

  if (extraClassName) {
    className.push(extraClassName);
  }

  // The outer edge of the ring of bars is the edge of the box
  const barWidth = size * 0.25;
  const barHeight = size * 0.0875;
  const radius = size * 0.375;

  const bars: React.ReactNode[] = [];

  for (let i = 0; i < 12; i += 1) {
    const barStyle: React.CSSProperties = {
      width: barWidth,
      height: barHeight,
      animationDelay: `${(i - 12) / 10}s`,
      transform: `translate(-50%, -50%) rotate(${i * 30}deg) translate(${radius}px)`,
    };

    bars.push(<div style={barStyle} className="Spinner__bar" key={i} />);
  }

  return (
    <div
      className={className.join(' ')}
      role={label === false ? undefined : 'status'}
      aria-hidden={label === false || undefined}
      style={{
        width: size,
        height: size,
      }}
    >
      {bars}
      {label !== false && <span className="visually-hidden">{tm(label)}</span>}
    </div>
  );
}

export type SpinnerAreaProps = {
  /**
   * The smallest height of the area: "small" for a line (64px), "regular"
   * for a block (200px). To fill a whole pane, use Spinner.Overlay with no
   * veil.
   * @default "regular"
   */
  size?: 'small' | 'regular';
  /** See the label of Spinner */
  label?: TextMessage | false;
};

/**
 * A block in the flow that keeps a place for the content while it loads, with
 * the spinner at its center. It needs no positioned parent.
 */
function SpinnerArea({ size = 'regular', label }: SpinnerAreaProps) {
  return (
    <div className={`SpinnerArea SpinnerArea--${size}`}>
      <Spinner label={label} />
    </div>
  );
}

export type SpinnerOverlayProps = {
  /**
   * Draws a veil over the content that shows. Give `false` when there is no
   * content yet (a whole form that loads): the spinner is then at the
   * center of the free space.
   * @default true
   */
  veil?: boolean;
  /** See the label of Spinner */
  label?: TextMessage | false;
  /** Only for the place of the overlay (z-index), not for its look */
  className?: string;
};

/**
 * A layer that covers the nearest positioned parent, with the spinner at its
 * center. With the veil, the content shows, but it waits for a task (a save,
 * a transfer).
 */
function SpinnerOverlay({
  veil = true,
  label,
  className,
}: SpinnerOverlayProps) {
  return (
    <div
      className={['SpinnerOverlay', veil && 'SpinnerOverlay--veil', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Spinner label={label} />
    </div>
  );
}

export default Object.assign(Spinner, {
  Area: SpinnerArea,
  Overlay: SpinnerOverlay,
});
