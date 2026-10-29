import type { Instruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import type { CSSProperties, ReactNode } from 'react';
import type { RefCallback } from '../types';

export type ItemId = string | number;

export type TreeItem<D = any> = {
  id: ItemId;
  children: ItemId[];
  hasChildren?: boolean;
  isExpanded?: boolean;
  isChildrenLoading?: boolean;
  data?: D;
};

// The root item is not visible: its children are the first level of the tree.
export type TreeData<D = any> = {
  rootId: ItemId;
  items: Record<ItemId, TreeItem<D>>;
};

export type TreeSourcePosition = {
  parentId: ItemId;
  index: number;
};

// A destination without `index` puts the item at the end of the children of
// the parent
export type TreeDestinationPosition = {
  parentId: ItemId;
  index?: number;
};

export type FlattenedItem<D = any> = {
  item: TreeItem<D>;
  // The indexes of the ancestors of the item, from the root, then the index
  // of the item
  path: number[];
};

export type TreeDraggableProvided = {
  // Give it to the element of the row
  innerRef: RefCallback;
  // Give it to the drag handle. Without a handle in the DOM, the user drags
  // the whole row, or nothing when the tree has `handle`.
  dragHandleRef: RefCallback;
  draggableProps: {
    style: CSSProperties & { paddingLeft: number };
  };
  // Give it to the element of the row that takes the focus. The arrow keys
  // move the focus between these elements.
  treeItemProps: {
    'data-tree-item': true;
    'aria-expanded': boolean | undefined;
  };
  // The line that shows where the dragged item goes. Put it in the element
  // of the row, which must have a position.
  dropIndicator: ReactNode;
};

export type TreeDraggableSnapshot = {
  isDragging: boolean;
  // Where the dragged item goes, when the pointer is on this row
  instruction: Instruction | null;
  // True when a drop puts the dragged item in this row
  isCombineTarget: boolean;
};

export type RenderItemParams<D = any> = {
  item: TreeItem<D>;
  depth: number;
  provided: TreeDraggableProvided;
  snapshot: TreeDraggableSnapshot;
};
