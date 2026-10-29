import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../i18n';
import type { Message, TextMessage } from '../Message';
import Tooltip from '../overlays/Tooltip';

/** The publishing status of a record */
export type ItemStatusValue = 'published' | 'updated' | 'draft' | 'new';

type Display =
  /** Only the dot. The label goes in the tooltip and in the name for screen readers. */
  | {
      /** @default "dot" */
      display?: 'dot';
      /**
       * The name of the status, for example "Published". It goes in the
       * tooltip and in `aria-label`, thus it is a text.
       * @default the name of the status: "Published", "Unpublished changes", "Draft" or "New"
       */
      label?: TextMessage;
    }
  /** The dot and the label as text, where the status is the value itself */
  | {
      display: 'label';
      /**
       * The name of the status, for example "Unpublished changes"
       * @default the name of the status: "Published", "Unpublished changes", "Draft" or "New"
       */
      label?: Message;
    };

export type ItemStatusProps = Display & {
  /**
   * The status. "updated" is a published record with changes that are not
   * published. "new" has the color of "draft".
   */
  status: ItemStatusValue;
};

type Modifier = 'published' | 'outdated' | 'draft';

const statusToModifier: Record<ItemStatusValue, Modifier> = {
  published: 'published',
  updated: 'outdated',
  draft: 'draft',
  new: 'draft',
};

const defaultLabel: Record<ItemStatusValue, TextMessage> = {
  published: { id: 'item.shortStatus.published' },
  updated: { id: 'item.shortStatus.updated' },
  draft: { id: 'item.shortStatus.draft' },
  new: { id: 'item.shortStatus.new' },
};

// The module does not export Dot: a dot alone has no tooltip and no name for
// screen readers.
const Dot = React.memo(function Dot({ status }: { status: ItemStatusValue }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={classNames(
        'ItemStatus__dot',
        `ItemStatus__dot--${statusToModifier[status]}`,
      )}
    >
      <circle cx="50" cy="50" r="45" />
    </svg>
  );
});

/**
 * The status of a record: a colored dot, with its label in a tooltip or
 * as text. The color and the size are the same everywhere.
 */
function ItemStatus(props: ItemStatusProps) {
  const { tm, tc } = useTranslation();
  const { status } = props;

  if (props.display === 'label') {
    return (
      <span className="ItemStatus">
        <Dot status={status} />
        <span>{tc(props.label ?? defaultLabel[status])}</span>
      </span>
    );
  }

  const name = tm(props.label ?? defaultLabel[status]);

  return (
    // The tooltip goes above the dot: at its left, it covers the title of
    // a chip
    <Tooltip label={name}>
      <span className="ItemStatus" role="img" aria-label={name}>
        <Dot status={status} />
      </span>
    </Tooltip>
  );
}

export default React.memo(ItemStatus);
