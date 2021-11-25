import React, { CSSProperties, ReactNode } from 'react';
import cn from 'classnames';
import s from './styles.module.css.json';

type SectionProps = {
  title: ReactNode;
  children?: ReactNode;
  highlighted?: boolean;
  collapsible?: { isOpen: boolean; onToggle: () => void };
  headerClassName?: string;
  titleClassName?: string;
  headerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
};

export function Section({
  title,
  children,
  highlighted,
  collapsible,
  headerClassName,
  titleClassName,
  headerStyle,
  titleStyle,
}: SectionProps): JSX.Element {
  return (
    <div className={cn(s['Section'], { [s['Section--highlighted']]: highlighted })}>
      <div className={cn(s['Section__header'], headerClassName)} style={headerStyle}>
        <div
          className={cn(
            s['Section__title'],

            titleClassName,
          )}
          style={titleStyle}
        >
          {collapsible && (
            <button
              type="button"
              className={cn(s['Section__arrow'], {
                [s['Section__arrow--is-open']]: collapsible.isOpen,
              })}
              onClick={collapsible.onToggle}
            />
          )}
          <div className={s['Section__title__content']}>{title}</div>
        </div>
      </div>
      {(!collapsible || collapsible.isOpen) && children}
    </div>
  );
}
