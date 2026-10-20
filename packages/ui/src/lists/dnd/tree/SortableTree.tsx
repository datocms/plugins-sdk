import type {
  ElementDropTargetEventBasePayload,
  ElementDropTargetGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachInstruction,
  extractInstruction,
  type Instruction,
  type ItemMode,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import classNames from 'classnames';
import React, {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import DropIndicator from '../DropIndicator';
import { getGapTo } from '../getGapTo';
import {
  type DragData,
  type DragSource,
  getDragData,
  type RefCallback,
} from '../types';
import { useDraggable } from '../useDraggable';
import { useDragMonitor } from '../useDragMonitor';
import { useDropTarget } from '../useDropTarget';
import { TreeRowProvider } from './TreeRowContext';
import type {
  FlattenedItem,
  ItemId,
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition,
} from './types';
import { useTreeKeyboardNavigation } from './useTreeKeyboardNavigation';
import {
  flattenTree,
  getItem,
  getParent,
  getSourcePosition,
  hasChildren,
} from './utils';

type TreeItemDragData = DragData & {
  kind: 'tree-item';
  instanceId: string;
  id: ItemId;
  path: number[];
};

type TreeTargetData = {
  instanceId: string;
  id: ItemId;
  path: number[];
};

// The data of the space under the last row: a drop there moves the item to
// the end of the first level
type TreeTailTargetData = {
  instanceId: string;
  tail: true;
};

/**
 * How the rows show their indent. With "padding", the element of the row
 * spans the full width and has the indent as a left padding. With "margin",
 * the box of the row starts after the indent.
 */
export type TreeIndentStyle = 'padding' | 'margin';

export type SortableTreeProps<D = any> = {
  /**
   * The items of the tree. The root item does not show: its children are
   * the first level. Only the children of an item with `isExpanded` show.
   */
  tree: TreeData<D>;
  /**
   * Renders one row. Give `provided.innerRef` and
   * `provided.draggableProps.style` (the indent) to the element of the row,
   * `provided.dragHandleRef` to a DragHandle, `provided.treeItemProps` to
   * the element of the row that takes the focus, and put
   * `provided.dropIndicator` in the row, which must have a CSS `position`.
   */
  renderItem: (params: RenderItemParams<D>) => ReactNode;
  /** Runs when the user starts to drag an item */
  onDragStart?: (itemId: ItemId) => void;
  /**
   * Runs when the user drops an item. Give `source` and `destination` to
   * `moveItemOnTree` to change the tree. `destination` is undefined when the
   * drop moves nothing.
   */
  onDragEnd?: (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => void;
  /**
   * The indent of each level, in pixels
   * @default 30
   */
  offsetPerLevel?: number;
  /**
   * When false, the user cannot drag the items
   * @default true
   */
  isDragEnabled?: boolean;
  /**
   * When false, an item can change place, but it cannot go in another item
   * @default true
   */
  isNestingEnabled?: boolean;
  /**
   * Tells if the dragged item can go in this item, for example only in a
   * folder. It has an effect only with `isNestingEnabled`. By default, all
   * the items take children.
   */
  canNest?: (item: TreeItem<D>) => boolean;
  /** Tells if the user can drag this item. By default, all the items move. */
  canDrag?: (item: TreeItem<D>) => boolean;
  /**
   * How the rows show their indent
   * @default 'padding'
   */
  indentStyle?: TreeIndentStyle;
  /** A class for the element of the tree */
  className?: string;
  /**
   * Runs when the user opens or closes an item with the arrow keys. Give the
   * function that the rows run on a click on their toggle.
   */
  onToggle?: (itemId: ItemId) => void;
};

let instanceCounter = 0;

function adjustIndex(
  rawIndex: number,
  parentId: ItemId,
  source: TreeSourcePosition,
) {
  // The index is the position after the move. When the item comes from the
  // same parent and from a position before the target, the removal of the
  // item moves the target up by one.
  return source.parentId === parentId && source.index < rawIndex
    ? rawIndex - 1
    : rawIndex;
}

function destinationOf<D>(
  tree: TreeData<D>,
  instruction: Instruction,
  target: TreeTargetData,
  source: TreeSourcePosition,
): TreeDestinationPosition | undefined {
  if (instruction.type === 'instruction-blocked') {
    return undefined;
  }

  if (instruction.type === 'make-child') {
    return { parentId: target.id };
  }

  if (instruction.type === 'reparent') {
    const level = instruction.desiredLevel;
    const parent = getItem(tree, target.path.slice(0, level));

    if (!parent) {
      return undefined;
    }

    const index = adjustIndex(target.path[level] + 1, parent.id, source);
    return { parentId: parent.id, index };
  }

  const parentId = getParent(tree, target.path).id;
  const targetIndex = target.path[target.path.length - 1];
  const rawIndex =
    instruction.type === 'reorder-above' ? targetIndex : targetIndex + 1;

  return { parentId, index: adjustIndex(rawIndex, parentId, source) };
}

function isSamePosition(
  source: TreeSourcePosition,
  destination: TreeDestinationPosition | undefined,
) {
  return (
    !!destination &&
    destination.parentId === source.parentId &&
    destination.index === source.index
  );
}

type RowProps<D> = {
  instanceId: string;
  flattenedItem: FlattenedItem<D>;
  mode: ItemMode;
  offsetPerLevel: number;
  isDragEnabled: boolean;
  isDropEnabled: boolean;
  canBeParent: boolean;
  indentStyle: TreeIndentStyle;
  renderItem: (params: RenderItemParams<D>) => ReactNode;
  registerRow: (id: ItemId, element: HTMLElement | null) => void;
  getNeighbourRow: (id: ItemId, after: boolean) => HTMLElement | undefined;
};

function TreeRow<D>({
  instanceId,
  flattenedItem,
  mode,
  offsetPerLevel,
  isDragEnabled,
  isDropEnabled,
  canBeParent,
  indentStyle,
  renderItem,
  registerRow,
  getNeighbourRow,
}: RowProps<D>) {
  const { item, path } = flattenedItem;
  const depth = path.length - 1;
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [gap, setGap] = useState(0);

  const getData = useCallback(
    (): TreeItemDragData => ({
      kind: 'tree-item',
      instanceId,
      id: item.id,
      path,
    }),
    [instanceId, item.id, path],
  );

  const {
    ref: draggableRef,
    handleRef,
    isDragging,
  } = useDraggable({ getData, disabled: !isDragEnabled });

  const canDrop = useCallback(
    (source: DragSource) => {
      const data = getDragData(source) as TreeItemDragData;

      return (
        data.kind === 'tree-item' &&
        data.instanceId === instanceId &&
        data.id !== item.id
      );
    },
    [instanceId, item.id],
  );

  const getTargetData = useCallback(
    ({ input, element }: ElementDropTargetGetFeedbackArgs) =>
      attachInstruction(
        { instanceId, id: item.id, path } satisfies TreeTargetData,
        {
          input,
          element,
          currentLevel: depth,
          indentPerLevel: offsetPerLevel,
          mode,
          block: canBeParent ? undefined : ['make-child'],
        },
      ),
    [instanceId, item.id, path, depth, offsetPerLevel, mode, canBeParent],
  );

  const updateInstruction = useCallback(
    ({ self }: ElementDropTargetEventBasePayload) => {
      // attachInstruction gives the same object for the same instruction, thus
      // the state changes only when the instruction changes
      const next = extractInstruction(self.data);
      setInstruction(next);

      if (
        next &&
        next.type !== 'make-child' &&
        next.type !== 'instruction-blocked'
      ) {
        const after = next.type !== 'reorder-above';
        setGap(
          getGapTo(
            self.element,
            getNeighbourRow(item.id, after),
            after ? 'bottom' : 'top',
          ),
        );
      }
    },
    [getNeighbourRow, item.id],
  );

  const clearInstruction = useCallback(() => setInstruction(null), []);

  const { ref: dropTargetRef } = useDropTarget({
    canDrop,
    getData: getTargetData,
    disabled: !isDropEnabled,
    // The row stays the target while the pointer is in the space between
    // two rows, thus the cue does not blink when the pointer crosses it
    sticky: true,
    onDragEnter: updateInstruction,
    onDrag: updateInstruction,
    onDragLeave: clearInstruction,
    onDrop: clearInstruction,
  });

  const innerRef = useCallback<RefCallback>(
    (node) => {
      draggableRef(node);
      dropTargetRef(node);
      registerRow(item.id, node);
    },
    [draggableRef, dropTargetRef, registerRow, item.id],
  );

  const dropIndicator = useMemo(() => {
    if (!instruction || instruction.type === 'instruction-blocked') {
      return null;
    }

    if (instruction.type === 'make-child') {
      return null;
    }

    const level =
      instruction.type === 'reparent' ? instruction.desiredLevel : depth;
    const inset =
      indentStyle === 'padding'
        ? level * offsetPerLevel
        : (level - depth) * offsetPerLevel;

    return (
      <DropIndicator
        edge={instruction.type === 'reorder-above' ? 'top' : 'bottom'}
        gap={`${gap}px`}
        inset={`${inset}px`}
      />
    );
  }, [instruction, gap, depth, offsetPerLevel, indentStyle]);

  const provided = useMemo(
    () => ({
      innerRef,
      dragHandleRef: handleRef,
      draggableProps: {
        style: { paddingLeft: depth * offsetPerLevel },
      },
      treeItemProps: {
        'data-tree-item': true as const,
        'aria-expanded': hasChildren(item) ? !!item.isExpanded : undefined,
      },
      dropIndicator,
    }),
    [innerRef, handleRef, depth, offsetPerLevel, item, dropIndicator],
  );

  const snapshot = useMemo(
    () => ({
      isDragging,
      instruction,
      isCombineTarget: instruction?.type === 'make-child',
    }),
    [isDragging, instruction],
  );

  const treeRow = useMemo(() => ({ provided, snapshot }), [provided, snapshot]);

  return (
    <TreeRowProvider value={treeRow}>
      {renderItem({ item, depth, provided, snapshot })}
    </TreeRowProvider>
  );
}

const MemoTreeRow = React.memo(TreeRow) as typeof TreeRow;

type TailProps = {
  instanceId: string;
  // True while the user drags an item of the tree
  isActive: boolean;
  getLastRow: () => { element: HTMLElement; depth: number } | undefined;
  offsetPerLevel: number;
  indentStyle: TreeIndentStyle;
};

type TailLine = { gap: number; left: number; right: number };

// The last row moves an item to the first level only when the pointer is at
// the left of its indent. The space under the last row moves the item to the
// end of the first level from any position of the pointer.
const TreeTail = React.memo(function TreeTail({
  instanceId,
  isActive,
  getLastRow,
  offsetPerLevel,
  indentStyle,
}: TailProps) {
  // The line has the edges of a row of the first level, thus it looks as the
  // line of a row (with its dot in the space at the left of the rows)
  const [line, setLine] = useState<TailLine | null>(null);

  const canDrop = useCallback(
    (source: DragSource) => {
      const data = getDragData(source) as TreeItemDragData;
      return data.kind === 'tree-item' && data.instanceId === instanceId;
    },
    [instanceId],
  );

  const getTargetData = useCallback(
    () => ({ instanceId, tail: true }) satisfies TreeTailTargetData,
    [instanceId],
  );

  const handleEnter = useCallback(
    ({ self }: ElementDropTargetEventBasePayload) => {
      const lastRow = getLastRow();

      if (!lastRow) {
        setLine({ gap: 0, left: 0, right: 0 });
        return;
      }

      const own = self.element.getBoundingClientRect();
      const row = lastRow.element.getBoundingClientRect();
      // With the "margin" indent, the box of the row starts after its indent
      const indent =
        indentStyle === 'margin' ? lastRow.depth * offsetPerLevel : 0;

      setLine({
        gap: getGapTo(self.element, lastRow.element, 'top'),
        left: row.left - indent - own.left,
        right: own.right - row.right,
      });
    },
    [getLastRow, indentStyle, offsetPerLevel],
  );

  const handleLeave = useCallback(() => setLine(null), []);

  const { ref } = useDropTarget({
    canDrop,
    getData: getTargetData,
    disabled: !isActive,
    onDragEnter: handleEnter,
    onDragLeave: handleLeave,
    onDrop: handleLeave,
  });

  return (
    <div
      ref={ref}
      className={classNames('SortableTree__tail', { 'is-active': isActive })}
    >
      {line && (
        <div
          className="SortableTree__tail-line"
          style={{ left: line.left, right: line.right }}
        >
          <DropIndicator edge="top" gap={`${line.gap}px`} />
        </div>
      )}
    </div>
  );
});

function SortableTree<D = any>({
  tree,
  renderItem,
  onDragStart,
  onDragEnd,
  offsetPerLevel = 30,
  isDragEnabled = true,
  isNestingEnabled = true,
  canNest,
  canDrag,
  indentStyle = 'padding',
  className,
  onToggle,
}: SortableTreeProps<D>) {
  const instanceId = useMemo(() => `sortable-tree-${instanceCounter++}`, []);

  // The children of the dragged item hide during the drag, thus the item
  // moves with its children
  const [collapsedId, setCollapsedId] = useState<ItemId | null>(null);

  const latest = useRef({ tree, onDragStart, onDragEnd, canNest });
  latest.current = { tree, onDragStart, onDragEnd, canNest };

  useDragMonitor({
    canMonitor: (source) =>
      getDragData(source).kind === 'tree-item' &&
      getDragData(source).instanceId === instanceId,
    onDragStart: ({ source }) => {
      const data = getDragData(source) as TreeItemDragData;
      setCollapsedId(data.id);
      latest.current.onDragStart?.(data.id);
    },
    onDrop: ({ source, location }) => {
      setCollapsedId(null);

      const data = getDragData(source) as TreeItemDragData;
      const { tree, onDragEnd } = latest.current;
      const sourcePosition = getSourcePosition(tree, data.path);

      const target = location.current.dropTargets.find(
        (dropTarget) => dropTarget.data.instanceId === instanceId,
      );

      if (!target) {
        onDragEnd?.(sourcePosition, undefined);
        return;
      }

      if ('tail' in target.data) {
        const root = tree.items[tree.rootId];
        const destination = {
          parentId: root.id,
          index: adjustIndex(root.children.length, root.id, sourcePosition),
        };

        onDragEnd?.(
          sourcePosition,
          isSamePosition(sourcePosition, destination) ? undefined : destination,
        );
        return;
      }

      const instruction = extractInstruction(target.data);
      const destination = instruction
        ? destinationOf(
            tree,
            instruction,
            target.data as unknown as TreeTargetData,
            sourcePosition,
          )
        : undefined;

      onDragEnd?.(
        sourcePosition,
        isSamePosition(sourcePosition, destination) ? undefined : destination,
      );
    },
  });

  const flattenedItems = useMemo(
    () => flattenTree(tree, collapsedId),
    [tree, collapsedId],
  );

  const rows = useRef(new Map<ItemId, HTMLElement>());
  const latestFlattenedItems = useRef(flattenedItems);
  latestFlattenedItems.current = flattenedItems;

  const registerRow = useCallback((id: ItemId, element: HTMLElement | null) => {
    if (element) {
      rows.current.set(id, element);
    } else {
      rows.current.delete(id);
    }
  }, []);

  const getNeighbourRow = useCallback((id: ItemId, after: boolean) => {
    const items = latestFlattenedItems.current;
    const index = items.findIndex((flattened) => flattened.item.id === id);
    const neighbour = items[index + (after ? 1 : -1)];

    return neighbour && rows.current.get(neighbour.item.id);
  }, []);

  const getLastRow = useCallback(() => {
    const items = latestFlattenedItems.current;
    const last = items[items.length - 1];

    const element = last && rows.current.get(last.item.id);

    return element && { element, depth: last.path.length - 1 };
  }, []);

  const handleKeyDown = useTreeKeyboardNavigation({
    rows,
    flattenedItems: latestFlattenedItems,
    onToggle,
  });

  return (
    <div
      className={classNames('SortableTree', className)}
      onKeyDown={handleKeyDown}
    >
      {flattenedItems.map((flattenedItem) => {
        const { item, path } = flattenedItem;
        const parent = getParent(tree, path);
        const isLast = path[path.length - 1] === parent.children.length - 1;
        const showsChildren =
          !!item.isExpanded &&
          item.children.length > 0 &&
          item.id !== collapsedId;

        const mode: ItemMode = showsChildren
          ? 'expanded'
          : isLast && path.length > 1
            ? 'last-in-group'
            : 'standard';

        return (
          <MemoTreeRow
            key={item.id}
            instanceId={instanceId}
            flattenedItem={flattenedItem}
            mode={mode}
            offsetPerLevel={offsetPerLevel}
            isDragEnabled={isDragEnabled && (canDrag?.(item) ?? true)}
            isDropEnabled={isDragEnabled}
            canBeParent={isNestingEnabled && (canNest?.(item) ?? true)}
            indentStyle={indentStyle}
            renderItem={renderItem}
            registerRow={registerRow}
            getNeighbourRow={getNeighbourRow}
          />
        );
      })}
      {isDragEnabled && (
        <TreeTail
          instanceId={instanceId}
          isActive={collapsedId !== null}
          getLastRow={getLastRow}
          offsetPerLevel={offsetPerLevel}
          indentStyle={indentStyle}
        />
      )}
    </div>
  );
}

export default React.memo(SortableTree) as typeof SortableTree;
