import React from 'react';
import cn from 'classnames';
import s from './styles.module.css.json';

export type SwitchInputChangeEventHandler = (
  newValue: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;

export interface SwitchInputProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  name: string;
  disabled?: boolean;
  onChange: SwitchInputChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  value: boolean;
}

export function SwitchInput({
  className,
  value,
  disabled,
  onClick,
  onChange,
  onKeyDown,
  ...restProps
}: SwitchInputProps): JSX.Element {
  function triggerChange(
    newValue: boolean,
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) {
    if (!disabled) {
      onChange(newValue, event);
    }
  }

  function onInternalKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowLeft') {
      triggerChange(false, e);
    } else if (e.key === 'ArrowRight') {
      triggerChange(true, e);
    }
    onKeyDown?.(e);
  }

  function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
    triggerChange(!value, e);
    onClick?.(e);
  }

  const switchClassName = cn(s['switchInput'], className, {
    [s['switchInput__checked']]: value,
    [s['switchInput__disabled']]: disabled,
  });

  return (
    <button
      {...restProps}
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      className={switchClassName}
      onKeyDown={onInternalKeyDown}
      onClick={onInternalClick}
    >
      <span className={s['switchInput__inner']} />
    </button>
  );
}
