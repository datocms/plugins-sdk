import React, {
  Children,
  useCallback,
  CSSProperties,
  FormEventHandler,
  FormEvent,
  ReactNode,
} from 'react';
import cn from 'classnames';
import styles from './styles.module.css.json';

export interface FormProps {
  onSubmit?: FormEventHandler;
  spacing?: 'condensed' | 'default';
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

export const Form = ({
  children,
  className,
  onSubmit,
  spacing = 'default',
  ...otherProps
}: FormProps): JSX.Element => {
  const classNames = cn(styles.Form, className);

  const formItemClassNames = cn(
    styles.Form__item,
    styles[`Form__item--${spacing}`],
  );

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (onSubmit) {
        onSubmit(event);
      }
    },
    [onSubmit],
  );

  return (
    <form className={classNames} onSubmit={handleSubmit} {...otherProps}>
      {Children.map(children, (child) => {
        if (child) {
          return <div className={formItemClassNames}>{child}</div>;
        }
        return null;
      })}
    </form>
  );
};
