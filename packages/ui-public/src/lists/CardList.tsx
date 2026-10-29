import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Generic } from '../../icons/index';
import Button from '../actions/Button';
import { Dropdown } from '../actions/Dropdown';
import { useSmartRowClick } from '../hooks/useSmartRowClick';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import { DisclosureChevron } from '../navigation/Chevron';
import RawButton from '../semantic/RawButton';
import { type ActionOrMenu } from './ActionOrMenu';

export type CardListHeader = {
  /** The icon of the entity of the items (a model, a plugin) */
  image?: ReactNode;
  /** The name of the entity of the items */
  title: Message;
  /** A short note after the title, in the subtle ink (for example an API key) */
  aside?: Message;
  /** The content at the end of the header (for example counters) */
  trailing?: ReactNode;
  /**
   * Only for a card that opens and closes. When the card is closed, it
   * shows only its header. Without `onToggle`, the card cannot close (for
   * example, it shows an error) and the chevron is disabled.
   */
  collapse?: { open: boolean; onToggle?: () => void };
};

export type CardListProps = {
  /** A strip above the items, with the entity of the items */
  header?: CardListHeader;
  /** The button that adds an item, in the footer of the card */
  add?: ActionOrMenu;
  /**
   * Shows in place of the card when the card has no items (for example an
   * EmptySlot with the button that adds the first item)
   */
  empty?: ReactNode;
  /**
   * When the actions of the items show. With `hover`, they show only when
   * the pointer or the focus is on the item, when its menu is open or when
   * the item is open (on devices without a pointer, always). Use `always`
   * in a list that the user only reads: the actions are the only way to go
   * further, and the row under the pointer gets the hover surface.
   */
  actionsVisibility?: 'hover' | 'always';
  className?: string;
  id?: string;
  /** The CardList.Item elements */
  children?: ReactNode;
};

/**
 * A list of items in one card (the rules of a role, the triggers of a
 * webhook, the editor and the add-ons of a field). See _CardList.css.
 *
 * The items are CardList.Item elements. They must be direct children of the
 * card, or come from components that return CardList.Item elements.
 *
 * The components are not memoized: they get JSX and objects that the parent
 * makes at each render. Memoize the components that make the items.
 */
function CardList({
  header,
  add,
  empty,
  actionsVisibility = 'hover',
  className,
  id,
  children,
}: CardListProps) {
  if (empty && React.Children.toArray(children).length === 0) {
    return <>{empty}</>;
  }

  const open = header?.collapse ? header.collapse.open : true;

  return (
    <div
      className={classNames(
        'CardList',
        { 'CardList--actions-always': actionsVisibility === 'always' },
        className,
      )}
      id={id}
    >
      {header && <CardListHeaderStrip {...header} />}
      {open && (
        <>
          <ul className="CardList__items">{children}</ul>
          {add && <CardListAddButton {...add} />}
        </>
      )}
    </div>
  );
}

function CardListHeaderStrip({
  image,
  title,
  aside,
  trailing,
  collapse,
}: CardListHeader) {
  const { tc } = useTranslation();
  const content = (
    <>
      {collapse && <DisclosureChevron open={collapse.open} />}
      {image && <span className="CardList__image">{image}</span>}
      <span className="CardList__title">{tc(title)}</span>
      {aside && <span className="CardList__aside">{tc(aside)}</span>}
      {trailing && <span className="CardList__trailing">{trailing}</span>}
    </>
  );

  if (!collapse) {
    return <div className="CardList__header">{content}</div>;
  }

  return (
    <RawButton
      className="CardList__header CardList__header--toggle"
      onClick={collapse.onToggle}
      expandable={{ open: collapse.open }}
      disabled={!collapse.onToggle}
    >
      {content}
    </RawButton>
  );
}

function CardListAddButton({
  label,
  icon = Generic.AddIcon,
  onClick,
  options,
}: ActionOrMenu) {
  return (
    <div className="CardList__footer">
      {onClick ? (
        <Button
          tone="ghost"
          size="milli"
          onClick={onClick}
          icon={icon}
          label={label}
        />
      ) : (
        <Dropdown
          triggerComponent={Dropdown.ButtonTrigger}
          label={label}
          icon={icon}
          size="milli"
          tone="ghost"
        >
          <Dropdown.Menu placement="bottom-start">{options}</Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export type CardListRow = {
  /**
   * The content of the row: a sentence, an EntityRow. In an item that opens
   * and closes, it is in the disclosure button: it must not have links or
   * buttons.
   */
  summary: ReactNode;
  /** The content after the summary (for example the state of a rule) */
  trailing?: ReactNode;
  /**
   * The actions of the item (an icon button, a menu, a "Change" button).
   * They go in a column with the width of a micro icon button at least,
   * thus the icon actions of all the items align.
   */
  actions?: ReactNode;
};

export type CardListExpandable = {
  /** The body shows */
  open: boolean;
  /** Runs on a click on the row or on its disclosure button */
  onToggle: () => void;
  /** Shows below the row when the item is open */
  body: ReactNode;
};

/** A row, with an optional body that always shows */
type ItemWithRow = {
  row: CardListRow;
  /** Shows below the row (for example the fields of the item) */
  body?: ReactNode;
  expandable?: never;
};

/** A row that opens and closes the body */
type ExpandableItem = {
  row: CardListRow;
  expandable: CardListExpandable;
  body?: never;
};

/** Only a body, without a row (for example the only item of a field) */
type ItemWithoutRow = {
  row?: never;
  /** The content of the item */
  body: ReactNode;
  expandable?: never;
};

/**
 * The other props go to the `li`, thus the item can be the trigger of a
 * Tooltip for the whole row
 */
type ItemElementProps = Omit<
  React.HTMLAttributes<HTMLLIElement>,
  'children' | 'className'
>;

export type CardListItemProps = { className?: string } & ItemElementProps &
  (ItemWithRow | ExpandableItem | ItemWithoutRow);

/** An item of a CardList: a row, a body, or a row with a body */
const Item = React.forwardRef<HTMLLIElement, CardListItemProps>(function Item(
  { className, row, body, expandable, ...elementProps },
  ref,
) {
  const visibleBody = expandable ? expandable.open && expandable.body : body;

  // A click on the row (not on a control of the row) opens or closes the
  // item, as a click on the disclosure button
  const handleRowClick = useSmartRowClick(
    () => expandable?.onToggle(),
    Boolean(expandable),
  );

  return (
    <li
      {...elementProps}
      ref={ref}
      className={classNames(
        'CardList__item',
        { 'is-open': expandable?.open },
        className,
      )}
    >
      {row && (
        <div
          className={classNames('CardList__row', {
            'CardList__row--toggle': expandable,
          })}
          onClick={handleRowClick}
        >
          {expandable ? (
            <RawButton
              className="CardList__summary CardList__summary--toggle"
              expandable={{ open: expandable.open }}
              onClick={expandable.onToggle}
            >
              {row.summary}
            </RawButton>
          ) : (
            <div className="CardList__summary">{row.summary}</div>
          )}
          {row.trailing}
          <div className="CardList__actions">{row.actions}</div>
        </div>
      )}
      {visibleBody && <div className="CardList__body">{visibleBody}</div>}
    </li>
  );
});

export type CardListRemoveButtonProps = {
  /** The accessible name and the tooltip, for example "Remove trigger" */
  label: TextMessage;
  onClick: () => void;
};

/** The trash button that removes an item from the list. Put it in the actions of the row. */
function RemoveButton({ label, onClick }: CardListRemoveButtonProps) {
  return (
    <Button
      tone="ghost-alert"
      size="micro"
      iconOnly
      icon={Generic.DeleteIcon}
      label={label}
      onClick={onClick}
    />
  );
}

export default Object.assign(CardList, { Item, RemoveButton });
