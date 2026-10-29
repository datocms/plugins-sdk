import React, { ReactNode } from 'react';
import Heading, { HeadingLevel } from '../../semantic/Heading';
import Group from './Group';

// The title is a flex container. Text in a flex container does not show an
// ellipsis, thus put the text in a span. Text that is next to other text (for
// example an emoji, a space and a label) goes in the same span, thus the gap
// of the flex container does not separate it.
function groupText(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];
  let text = '';

  const flushText = () => {
    if (text) {
      result.push(
        <span key={`text-${result.length}`} className="Toolbar__title__text">
          {text}
        </span>,
      );
      text = '';
    }
  };

  for (const child of React.Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
    } else {
      flushText();
      result.push(child);
    }
  }

  flushText();

  return result;
}

export type TitleProps = {
  /** The title. A long title ends with an ellipsis. */
  children: ReactNode;
  /**
   * The level of the title as a heading. Give it only to a title inside
   * <main> or inside a dialog: the title of the content is level 1. Without
   * it, the title is not a heading (for example the title of a sidebar).
   */
  level?: HeadingLevel;
  /**
   * The help of the page (a Toolbar.Help). The "?" button shows after the
   * title, in one group with it: the group gap is the space between them.
   * Do not put a Toolbar.Help next to the title as a sibling.
   */
  help?: ReactNode;
  /** For aria-labelledby (for example the title of a dialog) */
  id?: string;
};

/** The title of the toolbar, at its left end */

function Title({ children, level, help, id }: TitleProps) {
  const content = groupText(children);
  const title = level ? (
    <Heading level={level} className="Toolbar__title" id={id}>
      {content}
    </Heading>
  ) : (
    <div className="Toolbar__title" id={id}>
      {content}
    </div>
  );

  if (!help) {
    return title;
  }

  return (
    <Group>
      {title}
      {help}
    </Group>
  );
}

export default Title;
