import classNames from 'classnames';
import React from 'react';

export type PageContentProps = {
  children: React.ReactNode;
  className?: string;
};

/** The content of a Page: its sections and groups */
export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={classNames('Page__content', className)}>{children}</div>
  );
}
