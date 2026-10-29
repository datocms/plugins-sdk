import type {
  ElementDropTargetEventBasePayload,
  ElementDropTargetGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/types';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/attach-closest-edge';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import DropIndicator from './DropIndicator';
import { getGapTo, isAfterEdge } from './getGapTo';
import {
  type DragData,
  type DragSource,
  getDragData,
  type RefCallback,
} from './types';
import { type DragPreview, useDraggable } from './useDraggable';
import { useDragMonitor } from './useDragMonitor';
import { useDropTarget } from './useDropTarget';

export type SortableAxis = 'vertical' | 'horizontal';

export const ROOT_CONTAINER_ID = 'root';

export type SortableLocation = {
  index: number;
  containerId: string;
};

// `destination.index` is the index of the element in the destination list
// after the move.
export type SortableDropResult = {
  draggableId: string;
  source: SortableLocation;
  destination: SortableLocation;
};

export type SortableItemData = DragData & {
  kind: 'sortable-item';
  instanceId: string;
  id: string;
  index: number;
  containerId: string;
};

type SortableTargetData = {
  instanceId: string;
  role: 'item' | 'container';
  id?: string;
  index?: number;
  containerId: string;
  itemCount?: number;
};

type ListContextValue = {
  instanceId: string;
  axis: SortableAxis;
  disabled: boolean;
  // The data of the element that the user drags, or null
  active: SortableItemData | null;
  canDropInto: (source: SortableItemData, containerId: string) => boolean;
};

const ListContext = createContext<ListContextValue | null>(null);

function useListContext(componentName: string) {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error(`<${componentName}> must be in a <SortableList>`);
  }

  return context;
}

let instanceCounter = 0;

export type SortableListProps = {
  /** The `SortableItem` elements, in any structure. */
  children: ReactNode;
  /**
   * The direction of the list. Use `horizontal` for a row of items, such as
   * table columns or the pictures of a gallery.
   * @default 'vertical'
   */
  axis?: SortableAxis;
  /**
   * Stops the user from dragging the items.
   * @default false
   */
  disabled?: boolean;
  /**
   * Runs when the user drops an item at a new place. Use the indexes to
   * change your data. A drop that does not move the item does not run it.
   */
  onDrop: (result: SortableDropResult) => void;
  /**
   * Tells if an item can go in a container. By default, all the items can
   * go in all the containers. For example, a fieldset cannot go in another
   * fieldset.
   */
  canDropInto?: (source: SortableItemData, containerId: string) => boolean;
};

const ALLOWED_EDGES: Record<SortableAxis, Edge[]> = {
  vertical: ['top', 'bottom'],
  horizontal: ['left', 'right'],
};

// `gap` is the space between the item and its neighbour on the side of
// `edge`, in pixels
type EdgeTarget = {
  edge: Edge;
  gap: number;
};

// The component renders no element, thus the items can be in any structure
// (a div, a table body, a flex row).
export function SortableList({
  children,
  axis = 'vertical',
  disabled = false,
  onDrop,
  canDropInto,
}: SortableListProps) {
  const instanceId = useMemo(() => `sortable-list-${instanceCounter++}`, []);
  const [active, setActive] = useState<SortableItemData | null>(null);

  const latest = useRef({ onDrop, canDropInto });
  latest.current = { onDrop, canDropInto };

  useDragMonitor({
    canMonitor: (source) =>
      getDragData(source).kind === 'sortable-item' &&
      getDragData(source).instanceId === instanceId,
    onDragStart: ({ source }) => {
      setActive(getDragData(source) as SortableItemData);
    },
    onDrop: ({ source, location }) => {
      setActive(null);

      const sourceData = getDragData(source) as SortableItemData;

      const target = location.current.dropTargets.find(
        (dropTarget: DropTargetRecord) =>
          dropTarget.data.instanceId === instanceId,
      );

      if (!target) {
        return;
      }

      const targetData = target.data as unknown as SortableTargetData;
      const from: SortableLocation = {
        index: sourceData.index,
        containerId: sourceData.containerId,
      };

      let to: SortableLocation;

      if (targetData.role === 'container') {
        if (targetData.containerId === from.containerId) {
          return;
        }

        to = {
          index: targetData.itemCount ?? 0,
          containerId: targetData.containerId,
        };
      } else {
        const edge = extractClosestEdge(target.data);
        const indexOfTarget = targetData.index ?? 0;

        if (targetData.containerId === from.containerId) {
          const index = getReorderDestinationIndex({
            startIndex: from.index,
            indexOfTarget,
            closestEdgeOfTarget: edge,
            axis,
          });

          if (index === from.index) {
            return;
          }

          to = { index, containerId: from.containerId };
        } else {
          to = {
            index: indexOfTarget + (isAfterEdge(edge) ? 1 : 0),
            containerId: targetData.containerId,
          };
        }
      }

      latest.current.onDrop({
        draggableId: sourceData.id,
        source: from,
        destination: to,
      });
    },
  });

  const stableCanDropInto = useCallback(
    (source: SortableItemData, containerId: string) =>
      latest.current.canDropInto?.(source, containerId) ?? true,
    [],
  );

  const value = useMemo<ListContextValue>(
    () => ({
      instanceId,
      axis,
      disabled,
      active,
      canDropInto: stableCanDropInto,
    }),
    [instanceId, axis, disabled, active, stableCanDropInto],
  );

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export function useSortableListState() {
  const { active, disabled } = useListContext('useSortableListState');

  return {
    isDragging: active !== null,
    disabled,
  };
}

const ContainerContext = createContext<string>(ROOT_CONTAINER_ID);

export type SortableContainerProps = {
  /** The name of the container. Use `ROOT_CONTAINER_ID` for the first level. */
  id: string;
  /**
   * The number of items in the container. A drop on the container itself
   * (not on one of its items) puts the element after the last item.
   */
  itemCount: number;
  /** Gets `ref` for the element that holds the items. */
  children: (api: { ref: RefCallback; isOver: boolean }) => ReactNode;
};

// Give `ref` to the element that contains the items. `isOver` is true only
// when the dragged item can go in the container.
export function SortableContainer({
  id,
  itemCount,
  children,
}: SortableContainerProps) {
  const { instanceId, canDropInto, active } =
    useListContext('SortableContainer');

  const canDrop = useCallback(
    (source: DragSource) => {
      const data = getDragData(source) as SortableItemData;

      return (
        data.kind === 'sortable-item' &&
        data.instanceId === instanceId &&
        canDropInto(data, id)
      );
    },
    [instanceId, canDropInto, id],
  );

  const getData = useCallback(
    (): SortableTargetData => ({
      instanceId,
      role: 'container',
      containerId: id,
      itemCount,
    }),
    [instanceId, id, itemCount],
  );

  const { ref, isOver } = useDropTarget({ canDrop, getData });

  const isOverAndCanDrop = isOver && !!active && canDropInto(active, id);

  return (
    <ContainerContext.Provider value={id}>
      {children({ ref, isOver: isOverAndCanDrop })}
    </ContainerContext.Provider>
  );
}

export type SortableItemApi = {
  // Give it to the element that moves
  ref: RefCallback;
  // Give it to the drag handle, when `handle` is true
  handleRef: RefCallback;
  isDragging: boolean;
  // The edge of the item where the dragged element goes, or null
  closestEdge: Edge | null;
  // The line that shows where the dragged element goes. Put it in the
  // element that has `ref`, which must have a position.
  dropIndicator: ReactNode;
};

export type SortableItemProps = {
  /** A name that stays the same when the item moves. It is `draggableId` in the drop result. */
  id: string;
  /** The position of the item in its list. */
  index: number;
  /**
   * Stops the user from dragging this item.
   * @default false
   */
  disabled?: boolean;
  /**
   * When `true`, the user drags the item only from its handle: give
   * `handleRef` to the grip.
   * @default false
   */
  handle?: boolean;
  /**
   * The picture that the browser shows during the drag. Use `none` when the
   * element itself shows the drag.
   * @default 'element'
   */
  preview?: DragPreview;
  /** Gets the `ref` of the item and the drop line, and renders the item. */
  children: (api: SortableItemApi) => ReactNode;
};

export function SortableItem({
  id,
  index,
  disabled = false,
  handle = false,
  preview,
  children,
}: SortableItemProps) {
  const {
    instanceId,
    axis,
    disabled: listDisabled,
    canDropInto,
  } = useListContext('SortableItem');
  const containerId = useContext(ContainerContext);
  const [target, setTarget] = useState<EdgeTarget | null>(null);

  const getData = useCallback(
    (): SortableItemData => ({
      kind: 'sortable-item',
      instanceId,
      id,
      index,
      containerId,
    }),
    [instanceId, id, index, containerId],
  );

  const {
    ref: draggableRef,
    handleRef,
    isDragging,
  } = useDraggable({
    getData,
    disabled: disabled || listDisabled,
    handle,
    preview,
  });

  const canDrop = useCallback(
    (source: DragSource) => {
      const data = getDragData(source) as SortableItemData;

      return (
        data.kind === 'sortable-item' &&
        data.instanceId === instanceId &&
        canDropInto(data, containerId)
      );
    },
    [instanceId, canDropInto, containerId],
  );

  const getTargetData = useCallback(
    ({ input, element }: ElementDropTargetGetFeedbackArgs) =>
      attachClosestEdge(
        {
          instanceId,
          role: 'item',
          id,
          index,
          containerId,
        } satisfies SortableTargetData,
        { input, element, allowedEdges: ALLOWED_EDGES[axis] },
      ),
    [instanceId, id, index, containerId, axis],
  );

  const updateEdge = useCallback(
    ({ self, source, location }: ElementDropTargetEventBasePayload) => {
      // Only the nearest item of the list shows the line. An item that
      // contains other items (for example, a fieldset with its fields) shows
      // no line when the pointer is on one of them
      const nearest = location.current.dropTargets.find(
        (dropTarget: DropTargetRecord) =>
          dropTarget.data.instanceId === instanceId,
      );

      if (nearest?.element !== self.element) {
        setTarget(null);
        return;
      }

      const data = getDragData(source) as SortableItemData;
      const edge = extractClosestEdge(self.data);

      // The line does not show when the drop does not move the element: on
      // the element itself, or next to its position
      const isNoop =
        data.containerId === containerId &&
        (data.index === index ||
          (data.index === index - 1 && !isAfterEdge(edge)) ||
          (data.index === index + 1 && isAfterEdge(edge)));

      const next: EdgeTarget | null =
        isNoop || !edge
          ? null
          : {
              edge,
              gap: getGapTo(
                self.element,
                isAfterEdge(edge)
                  ? self.element.nextElementSibling
                  : self.element.previousElementSibling,
                edge,
              ),
            };

      setTarget((current) =>
        current?.edge === next?.edge && current?.gap === next?.gap
          ? current
          : next,
      );
    },
    [instanceId, containerId, index, axis],
  );

  const clearEdge = useCallback(() => setTarget(null), []);

  const { ref: dropTargetRef } = useDropTarget({
    canDrop,
    getData: getTargetData,
    disabled: listDisabled,
    // The item stays the target while the pointer is in the space between
    // two items. Thus the line does not blink when the pointer crosses it
    sticky: true,
    onDragEnter: updateEdge,
    onDrag: updateEdge,
    onDragLeave: clearEdge,
    onDrop: clearEdge,
  });

  const ref = useCallback<RefCallback>(
    (node) => {
      draggableRef(node);
      dropTargetRef(node);
    },
    [draggableRef, dropTargetRef],
  );

  const dropIndicator = target ? (
    <DropIndicator edge={target.edge} gap={`${target.gap}px`} />
  ) : null;

  return (
    <>
      {children({
        ref,
        handleRef,
        isDragging,
        closestEdge: target?.edge ?? null,
        dropIndicator,
      })}
    </>
  );
}
