import React, { ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.css.json';

export type TextInputProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  textInputType?: 'primary' | 'muted' | 'negative';
  textInputSize?: 'xxs' | 'xs' | 's' | 'l' | 'xl';
  fullWidth?: boolean;
};

export default function TextInput({
  children,
  className,
  disabled,
  textInputType = 'muted',
  textInputSize = 's',
  fullWidth,
  ...other
}: TextInputProps): JSX.Element {
  return (
    <input
      type="text"
      className={cn(
        styles.textInput,
        styles[`textInputType-${textInputType}`],
        styles[`textInputSize-${textInputSize}`],
        {
          [styles.disabled]: disabled,
          [styles.fullWidth]: fullWidth,
        },
        className,
      )}
      disabled={disabled}
      {...other}
    />
  );
}
