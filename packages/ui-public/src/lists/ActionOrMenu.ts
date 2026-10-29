import { ReactNode } from 'react';
import { type Message } from '../Message';
import { SvgIcon } from '../utils/types';

/** The button runs its action at once */
type ClickAction = {
  /** The label of the button, for example "Add trigger" */
  label: Message;
  /**
   * The icon before the label
   * @default Generic.AddIcon
   */
  icon?: SvgIcon;
  onClick: (event: React.MouseEvent) => void;
  options?: never;
};

/** The button opens a menu, for example with the kinds of item to add */
type MenuAction = {
  /** The label of the button, for example "Add rule" */
  label: Message;
  /**
   * The icon before the label
   * @default Generic.AddIcon
   */
  icon?: SvgIcon;
  /** The Dropdown.Option elements of the menu */
  options: ReactNode;
  onClick?: never;
};

/**
 * The action of a button that a component draws for you, for example the
 * `add` button of a CardList or the `action` of an EmptySlot
 */
export type ActionOrMenu = ClickAction | MenuAction;
