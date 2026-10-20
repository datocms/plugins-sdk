import React from 'react';
import UiButton, { ButtonProps } from '../../actions/Button';

/**
 * The size comes from the toolbar ("milli"). We do not use Omit here,
 * because Omit removes the unions of the props.
 */
type Props = ButtonProps & { size?: never };

/**
 * A Button of a toolbar. It is "ghost" by default: most buttons of a
 * toolbar have no fill until the pointer is on them.
 */
const Button = React.forwardRef<HTMLElement, Props>(function Button(
  { tone = 'ghost', ...props },
  ref,
) {
  return <UiButton {...(props as ButtonProps)} ref={ref} tone={tone} />;
});

export default Button;
