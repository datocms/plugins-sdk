import React from 'react';
import cn from 'classnames';
import styles from './styles.module.css.json';

export interface FieldGroupProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function FieldGroup({
  children,
  className,
  ...otherProps
}: FieldGroupProps): JSX.Element {
  const classNames = cn(styles.FieldGroup, className);

  return (
    <div {...otherProps} className={classNames}>
      {React.Children.map(children, (child) => (
        <div className={styles.FieldGroup__item}>{child}</div>
      ))}
    </div>
  );
}
