import classNames from 'classnames';
import React from 'react';
import { type Message } from '../Message';
import Link from '../navigation/Link';
import type { FloatingTrigger } from '../overlays/floatingTrigger';
import Tooltip from '../overlays/Tooltip';
import RawButton from '../semantic/RawButton';
import { pillClassName } from './pillClassName';

/** The color of a pill */
export type PillTone =
  | 'neutral'
  | 'accent'
  | 'soft'
  | 'danger'
  | 'warning'
  | 'success';

/** A pill that opens a page. It is a link. */
type LinkPill = {
  /** The URL or the path that the pill opens, for example "/schema" */
  to: string;
  onClick?: never;
};

/** A pill that runs an action. It is a button. */
type ButtonPill = {
  to?: never;
  /** Runs when the user clicks the pill, for example to filter a list */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

/** A pill that only shows a fact. The user cannot click it. */
type StaticPill = {
  to?: never;
  onClick?: never;
};

type PillAction = LinkPill | ButtonPill | StaticPill;

export type PillProps = {
  /**
   * The color of the pill. "neutral" is grey, for a fact about the item.
   * "accent" is the primary color, for a fact that must get attention.
   * "soft" is the light primary color, for a tag or for a reference to
   * another item in a text. "danger" and "warning" are the soft red and
   * amber, for the status of a problem (for example the status of a
   * Page.Group with a tone). "success" is the soft green, for a status that
   * is good (for example "Paid", "Active").
   * @default 'neutral'
   */
  tone?: PillTone;
  /** An icon before the text, for example a model icon */
  icon?: React.ReactNode;
  /**
   * A hint in a tooltip, on hover and on keyboard focus. A static pill with a
   * tooltip takes the focus, thus the keyboard can reach the hint.
   */
  tooltip?: Message;
  /** The text of the pill. Keep it short: a long text gets an ellipsis. */
  children: React.ReactNode;
} & PillAction;

function Pill({ tone, icon, tooltip, children, to, onClick }: PillProps) {
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  let element: FloatingTrigger;

  if (to !== undefined) {
    element = (
      <Link to={to} className={pillClassName({ tone, clickable: true })}>
        {content}
      </Link>
    );
  } else if (onClick) {
    element = (
      <RawButton
        onClick={onClick}
        className={pillClassName({ tone, clickable: true })}
      >
        {content}
      </RawButton>
    );
  } else {
    element = (
      <span
        tabIndex={tooltip ? 0 : undefined}
        className={classNames(pillClassName({ tone }), {
          'Pill--hint': tooltip,
        })}
      >
        {content}
      </span>
    );
  }

  return tooltip ? <Tooltip label={tooltip}>{element}</Tooltip> : element;
}

export default React.memo(Pill);
