import classNames from 'classnames';
import React from 'react';
import { Navigation } from '../../icons/index';
import Spinner from '../feedback/Spinner';

// The chevrons set their size and their color (see _Chevron.css), thus the
// container sets only their place. A chevron gets the disabled color from its
// control (:disabled, aria-disabled, aria-expanded), thus it has no prop for
// the state. On a
// colored surface, the surface sets --chevron-color (see _Chevron.css).

export type DisclosureChevronProps = {
  /** True when the content is open. The chevron turns down. */
  open: boolean;
  /** A class for the place of the chevron (margin, alignment) */
  className?: string;
};

/**
 * For a toggle that opens content in place. Put it before the title. It
 * points right and turns down when the content is open.
 */
export const DisclosureChevron = React.memo(function DisclosureChevron({
  open,
  className,
}: DisclosureChevronProps) {
  return (
    <Navigation.ChevronRightIcon
      aria-hidden="true"
      className={classNames(
        'Chevron',
        'Chevron--disclosure',
        { 'is-open': open },
        className,
      )}
    />
  );
});

/**
 * For a row that has no content to open, so the titles of all the rows
 * align.
 */
export const DisclosureChevronPlaceholder = React.memo(
  function DisclosureChevronPlaceholder() {
    return <span aria-hidden="true" className="Chevron Chevron--disclosure" />;
  },
);

export type MenuChevronProps = {
  /** A class for the place of the chevron (margin, alignment) */
  className?: string;
};

/**
 * For a trigger that opens a menu or a popup. Put it after the label. It
 * does not turn when the menu opens: it gets the ink color while the trigger
 * has aria-expanded="true".
 */
export const MenuChevron = React.memo(function MenuChevron({
  className,
}: MenuChevronProps) {
  return (
    <Navigation.ChevronDownIcon
      aria-hidden="true"
      className={classNames('Chevron', 'Chevron--menu', className)}
    />
  );
});

export type LoadMoreChevronProps = {
  /**
   * True while the items load. A spinner shows in place of the chevron, with
   * the same size.
   * @default false
   */
  loading?: boolean;
};

/**
 * For a control that loads more items of a list. Put it before the label,
 * in the place that the DisclosureChevron has in the other rows.
 */
export const LoadMoreChevron = React.memo(function LoadMoreChevron({
  loading,
}: LoadMoreChevronProps) {
  if (loading) {
    // The control tells the state with its text
    return (
      <span className="Chevron Chevron--load-more Chevron--loading">
        <Spinner inline={true} label={false} />
      </span>
    );
  }

  return (
    <Navigation.ChevronsDownIcon
      aria-hidden="true"
      className="Chevron Chevron--load-more"
    />
  );
});
