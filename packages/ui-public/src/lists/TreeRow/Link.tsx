import React, { type ReactNode } from 'react';
import BaseLink, { type LinkProps } from '../../navigation/Link';

export type TreeRowLinkProps = Omit<LinkProps, 'className' | 'children'> & {
  /** The entity of the row: an EntityRow */
  children: ReactNode;
};

/**
 * The content of a `TreeRow` as a link, for example the link that opens a
 * record. Give it the `provided.treeItemProps` of SortableTree, thus the
 * arrow keys move the focus between the rows.
 */
export default function TreeRowLink({ children, ...props }: TreeRowLinkProps) {
  return (
    <BaseLink {...props} className="TreeRow__inner">
      <div className="RowList__content">{children}</div>
    </BaseLink>
  );
}
