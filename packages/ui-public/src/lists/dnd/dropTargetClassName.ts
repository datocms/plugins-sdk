import classNames from 'classnames';

export type DropTargetClassNameArgs = {
  /** The dragged element or the files are over the target now */
  isOver: boolean;
  /**
   * Shows only the ring, with no surface, for a target as large as the page
   * or a pane.
   * @default false
   */
  ringOnly?: boolean;
  /**
   * A drag is in progress, and the target does not take the dragged
   * element. The target fades, thus the user sees where the element cannot
   * go before the pointer gets there. Read the drag with `useActiveDrag`.
   * @default false
   */
  refused?: boolean;
};

/**
 * Gives the classes of the drop cue: a surface and a ring while a drag is
 * over the target, and a faded target while a drag that it refuses is in
 * progress. Add them to the class of the target. The target gets
 * `position: relative`. For a short text in the center ("Drop to replace"),
 * put a `div.DropTarget__label` with a `span` in the target.
 */
export function dropTargetClassName({
  isOver,
  ringOnly = false,
  refused = false,
}: DropTargetClassNameArgs): string {
  return classNames('DropTarget', {
    'DropTarget--ring-only': ringOnly,
    'is-over': isOver,
    'is-refused': refused,
  });
}
