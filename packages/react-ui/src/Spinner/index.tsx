import classNames from 'classnames';
import React from 'react';
import s from './styles.module.css.json';

type SpinnerProps = {
  size?: number;
  placement?: 'inline' | 'centered';
  style?: React.CSSProperties;
};

/**
 * @example Inline spinner
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   Foo bar <Spinner size={24} />
 * </Canvas>;
 * ```
 *
 * @example Centered spinner
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ height: '200px', position: 'relative' }}>
 *     <Spinner size={48} placement="centered" />
 *   </div>
 * </Canvas>;
 * ```
 */
export function Spinner({
  size = 32,
  placement = 'inline',
  style: extraStyle = {},
}: SpinnerProps): JSX.Element {
  const bars: React.ReactNode[] = [];

  for (let i = 0; i < 12; i += 1) {
    const barStyle: React.CSSProperties = {};
    barStyle.animationDelay = `${(i - 12) / 10}s`;
    barStyle.transform = `rotate(${i * 30}deg) translate(146%)`;
    bars.push(<div style={barStyle} className={s['Spinner__bar']} key={i} />);
  }

  const style: React.CSSProperties = {
    width: size * 0.5,
    height: size * 0.5,
  };

  if (placement === 'inline') {
    style.marginLeft = size * 0.5;
    style.transform = 'translateY(33%)';
  }

  return (
    <div
      className={classNames({
        [s['Spinner--inline']]: placement === 'inline',
        [s['Spinner--centered']]: placement === 'centered',
      })}
      style={{
        ...extraStyle,
        ...style,
      }}
    >
      {bars}
    </div>
  );
}
