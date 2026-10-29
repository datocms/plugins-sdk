import { createContext, useContext } from 'react';
import type { TreeDraggableProvided, TreeDraggableSnapshot } from './types';

export type TreeRow = {
  provided: TreeDraggableProvided;
  snapshot: TreeDraggableSnapshot;
};

const TreeRowContext = createContext<TreeRow | null>(null);

// SortableTree gives the drag objects of each row to the content of the row.
// Thus a row component (SidebarTree.Node) reads them, and the caller of
// renderItem does not pass them.
export const TreeRowProvider = TreeRowContext.Provider;

/** The drag objects of the row of a SortableTree, or null out of a tree */
export function useTreeRow() {
  return useContext(TreeRowContext);
}
