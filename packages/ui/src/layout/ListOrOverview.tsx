import React, { ReactElement, ReactNode } from 'react';
import Spinner from '../feedback/Spinner';

/**
 * The state of a section with a list:
 * - "loading": the first load did not end. Zero elements does not mean that
 *   the section is empty.
 * - "empty": the section has no elements.
 * - "ready": the section has elements. A filter that keeps no element is
 *   also "ready", because the section is not empty.
 */
export type ListOrOverviewState = 'loading' | 'empty' | 'ready';

/**
 * The state from the first load and the number of the elements. Give
 * "loaded" true only after the first load ends.
 */
export function getListOrOverviewState(
  loaded: boolean,
  empty: boolean,
): ListOrOverviewState {
  if (!empty) return 'ready';
  return loaded ? 'empty' : 'loading';
}

/**
 * The state and the overview. Only a list that can be empty has the "empty"
 * state, and then it must give the overview.
 */
export type ListOrOverviewContent =
  /** A list that can be empty */
  | {
      /** The state of the section (see getListOrOverviewState) */
      state: ListOrOverviewState;
      /**
       * All the area of the section when the section is empty: a BlankSlate
       * with titleLevel={1}, a description, the docs and the action that
       * adds the first element. It has no title bar.
       */
      overview: ReactElement;
    }
  /** A list that cannot be empty, for example the collaborators */
  | {
      state: Exclude<ListOrOverviewState, 'empty'>;
      overview?: never;
    };

export type ListOrOverviewProps = ListOrOverviewContent & {
  /** The list and the detail (a split pane), when the section has elements */
  children: ReactNode;
};

/**
 * The content of a section with a list. The list and its detail show only
 * when the section has elements: an empty section shows only the overview,
 * because a list with no elements and a "No … selected" detail have no use.
 * Before the first load, it shows a spinner.
 */
function ListOrOverview({ state, overview, children }: ListOrOverviewProps) {
  if (state === 'loading') {
    return <Spinner />;
  }

  if (state === 'empty') {
    return <>{overview}</>;
  }

  return <>{children}</>;
}

export default React.memo(ListOrOverview);
