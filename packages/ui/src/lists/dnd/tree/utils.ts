import type {
  FlattenedItem,
  ItemId,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition,
} from './types';

// `collapsedId` hides the children of one item: the item that the user drags.
export function flattenTree<D>(
  tree: TreeData<D>,
  collapsedId: ItemId | null = null,
): FlattenedItem<D>[] {
  const result: FlattenedItem<D>[] = [];

  function visit(parentId: ItemId, path: number[]) {
    const parent = tree.items[parentId];

    if (!parent) {
      return;
    }

    parent.children.forEach((childId, index) => {
      const item = tree.items[childId];

      if (!item) {
        return;
      }

      const itemPath = [...path, index];
      result.push({ item, path: itemPath });

      if (item.isExpanded && item.id !== collapsedId) {
        visit(childId, itemPath);
      }
    });
  }

  visit(tree.rootId, []);

  return result;
}

export function getItem<D>(
  tree: TreeData<D>,
  path: number[],
): TreeItem<D> | undefined {
  let item: TreeItem<D> | undefined = tree.items[tree.rootId];

  for (const index of path) {
    const childId: ItemId | undefined = item?.children[index];
    item = childId === undefined ? undefined : tree.items[childId];
  }

  return item;
}

export function getParent<D>(tree: TreeData<D>, path: number[]): TreeItem<D> {
  return getItem(tree, path.slice(0, -1)) ?? tree.items[tree.rootId];
}

// True when the item has children, also when they are not loaded yet
export function hasChildren<D>(item: TreeItem<D>) {
  return !!item.hasChildren || item.children.length > 0;
}

export function getSourcePosition<D>(
  tree: TreeData<D>,
  path: number[],
): TreeSourcePosition {
  return {
    parentId: getParent(tree, path).id,
    index: path[path.length - 1],
  };
}

function removeItemFromTree<D>(
  tree: TreeData<D>,
  source: TreeSourcePosition,
): { tree: TreeData<D>; itemId: ItemId | undefined } {
  const parent = tree.items[source.parentId];

  if (!parent) {
    return { tree, itemId: undefined };
  }

  const itemId = parent.children[source.index];
  const children = parent.children.filter((_, index) => index !== source.index);

  return {
    tree: {
      ...tree,
      items: {
        ...tree.items,
        [source.parentId]: {
          ...parent,
          children,
          hasChildren: children.length > 0,
        },
      },
    },
    itemId,
  };
}

function addItemToTree<D>(
  tree: TreeData<D>,
  destination: TreeDestinationPosition,
  itemId: ItemId,
): TreeData<D> {
  const parent = tree.items[destination.parentId];

  if (!parent) {
    return tree;
  }

  const children = [...parent.children];

  if (destination.index === undefined) {
    children.push(itemId);
  } else {
    children.splice(destination.index, 0, itemId);
  }

  return {
    ...tree,
    items: {
      ...tree.items,
      [destination.parentId]: {
        ...parent,
        children,
        hasChildren: true,
      },
    },
  };
}

export function moveItemOnTree<D>(
  tree: TreeData<D>,
  source: TreeSourcePosition,
  destination: TreeDestinationPosition,
): TreeData<D> {
  const { tree: treeWithoutItem, itemId } = removeItemFromTree(tree, source);

  if (itemId === undefined) {
    return tree;
  }

  return addItemToTree(treeWithoutItem, destination, itemId);
}

// Gives the "position" attribute to save for an item that the user drops at
// `destination`. Use it for the entities that keep their order in a
// "position" attribute (menu items, schema menu items, upload collections).
// The positions of the siblings can have gaps, thus the index of the drop is
// not a position. The item takes the position of the item that is now at its
// index, and the server moves the other items. After the last child, the
// position is the position of the last child plus one. In an item (no
// index), the item is the first child.
export function getDropPosition<D>(
  tree: TreeData<D>,
  destination: TreeDestinationPosition,
  positionOf: (item: TreeItem<D>) => number,
): number {
  if (!('index' in destination) || destination.index === undefined) {
    return 0;
  }

  const siblings = tree.items[destination.parentId].children;
  const hover = tree.items[siblings[destination.index]];

  if (hover) {
    return positionOf(hover);
  }

  const last = tree.items[siblings[siblings.length - 1]];

  return last ? positionOf(last) + 1 : destination.index;
}
