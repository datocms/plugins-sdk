import classNames from 'classnames';
import React from 'react';
import { Shortcut } from '../../actions/Actions/Shortcut';
import { type ActionShortcut } from '../../actions/Actions/shortcuts';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';

type TooltipBoxProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  label: Message;
  long?: boolean;
  /** The keys of the shortcut, after the label */
  keys?: ActionShortcut | ActionShortcut[];
  /** The tooltip fades out */
  closing?: boolean;
};

/**
 * The box of a tooltip with its text. `Tooltip` and its picture at rest
 * (`Static.tsx`) render it.
 */
const TooltipBox = React.forwardRef<HTMLDivElement, TooltipBoxProps>(
  function TooltipBox({ label, long, keys, closing, ...rest }, ref) {
    const { tc } = useTranslation();

    return (
      <div
        ref={ref}
        {...rest}
        className={classNames('Tooltip', {
          'Tooltip--long': long,
          'Tooltip--with-shortcut': keys !== undefined,
          'Tooltip--closing': closing,
        })}
      >
        {keys ? (
          <>
            <span className="Tooltip__label">{tc(label)}</span>
            <Shortcut keys={keys} />
          </>
        ) : (
          tc(label)
        )}
      </div>
    );
  },
);

export default TooltipBox;
