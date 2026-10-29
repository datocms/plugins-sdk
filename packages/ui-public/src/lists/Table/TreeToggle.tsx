import React, { type ReactNode } from 'react';
import { Generic } from '../../../icons/index';
import {
  type Disabled,
  DisabledReasonTooltip,
  disabledReasonOf,
} from '../../actions/disabledReason';
import Spinner from '../../feedback/Spinner';
import {
  DisclosureChevron,
  DisclosureChevronPlaceholder,
} from '../../navigation/Chevron';
import RawButton from '../../semantic/RawButton';

/** The toggle of a row with child rows */
export type TableRowExpandable = {
  /** True when the child rows show */
  open: boolean;
  /** Runs when the user clicks the toggle */
  onToggle: () => void;
  /**
   * The child rows load: a spinner takes the place of the chevron, and the
   * toggle does nothing
   */
  busy?: boolean;
  /**
   * The user cannot open or close the child rows. Give a reason when the
   * user must know why.
   */
  disabled?: Disabled;
};

// The toggle is in the row: a click on it must not open or select the row
function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation();
}

/**
 * The toggle column of a tree row. A row without child rows keeps the space
 * of the toggle, thus the contents of the rows align.
 */
export function TreeToggle({
  expandable,
  nested,
  labelledBy,
}: {
  expandable: TableRowExpandable | undefined;
  /** The row is not at the root of the tree */
  nested: boolean;
  /** The ID of the element with the name of the row */
  labelledBy: string | undefined;
}) {
  if (!expandable) {
    return (
      <TreeToggleSlot>
        {nested ? (
          <Generic.DashIcon className="Table__toggle__dash" />
        ) : (
          <DisclosureChevronPlaceholder />
        )}
      </TreeToggleSlot>
    );
  }

  const { open, onToggle, busy, disabled } = expandable;
  const hasReason = disabledReasonOf(disabled) !== undefined;

  return (
    <DisabledReasonTooltip disabled={disabled}>
      <RawButton
        className="Table__toggle"
        // The name of the row is the name of the toggle. The screen reader
        // adds "expanded" or "collapsed" from aria-expanded.
        ariaLabelledBy={labelledBy}
        expandable={{ open }}
        disabled={hasReason ? 'focusable' : Boolean(disabled)}
        aria-busy={busy || undefined}
        // RawButton drops the onClick of a disabled button, thus the capture
        // phase stops the click of a disabled toggle
        onClickCapture={disabled ? stopPropagation : undefined}
        onClick={(event) => {
          stopPropagation(event);

          if (!busy) {
            onToggle();
          }
        }}
      >
        {busy ? (
          <Spinner inline={true} label={false} />
        ) : (
          <DisclosureChevron open={open} />
        )}
      </RawButton>
    </DisabledReasonTooltip>
  );
}

/** The space of the toggle, with a content that is not a toggle */
export function TreeToggleSlot({ children }: { children: ReactNode }) {
  return (
    <span className="Table__toggle" aria-hidden="true">
      {children}
    </span>
  );
}
