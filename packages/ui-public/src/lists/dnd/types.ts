import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';

// Each kind of draggable element gives a different `kind`, thus a drop
// target can accept only the kinds that it knows.
export type DragData = Record<string, unknown> & {
  kind: string;
};

export type DragSource = ElementDragPayload;

export function getDragData(source: DragSource): DragData {
  return source.data as DragData;
}

export type RefCallback<T extends HTMLElement = HTMLElement> = (
  element: T | null,
) => void;
