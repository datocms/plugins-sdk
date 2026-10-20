import React, { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  /**
   * The level is always explicit. A heading is only inside <main> or inside
   * a dialog. The title of a page or of a dialog is level 1. A section of it
   * is level 2, and a section of that section is level 3. Do not skip a
   * level.
   */
  level: HeadingLevel;
  /** Gives the look. The level does not change the look. */
  className?: string;
  /** For example, the target of `aria-labelledby` of a dialog */
  id?: string;
  children: ReactNode;
};

const tags = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

/**
 * A heading. The level sets the structure of the page for screen readers.
 * The look comes from the class, thus a level 1 heading can look small.
 * A title that the user can click has a button or a link inside it.
 */
export default function Heading({
  level,
  className,
  id,
  children,
}: HeadingProps) {
  const Tag = tags[level];

  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
}
