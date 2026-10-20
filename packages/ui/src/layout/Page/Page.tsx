import classNames from 'classnames';
import React from 'react';

export type PageProps = {
  /** A Page.Content */
  children: React.ReactNode;
  className?: string;
  /**
   * The largest width of the page: 650px without it, 800px for `large`,
   * 1200px for `wide`
   */
  variant?: 'large' | 'wide';
  /**
   * The position of the page in its area. `start` puts the page at the
   * left, next to the sidebar.
   */
  align?: 'center' | 'start';
};

/**
 * The column of a page of content: settings, a form, a dashboard. It gives
 * the largest width and the space around the content.
 */

export function Page({
  children,
  className,
  variant,
  align = 'center',
}: PageProps) {
  return (
    <div
      className={classNames(
        'Page',
        {
          'Page--large': variant === 'large',
          'Page--wide': variant === 'wide',
          'Page--start': align === 'start',
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
