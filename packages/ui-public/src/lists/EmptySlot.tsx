import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Generic } from '../../icons/index';
import { buttonClassName } from '../actions/Button';
import { Dropdown } from '../actions/Dropdown';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import RawButton from '../semantic/RawButton';
import { type ActionOrMenu } from './ActionOrMenu';

type EmptySlotAction =
  /**
   * The actions show in the place of the message when the pointer is on the
   * slot, when an action has the focus or when its menu is open. On a touch
   * device, they always show.
   */
  | {
      /**
       * The buttons or the dropdown triggers that fill the field. Without
       * them and without `action`, the slot shows only its message.
       */
      children?: ReactNode;
      action?: never;
    }
  /**
   * The slot has one action. With `onClick`, all the slot is its button. With
   * `options`, the slot shows a button that opens the menu.
   */
  | {
      /**
       * The action of the slot. Do not give it when the user cannot fill the
       * field: the slot then shows only its message.
       */
      action: ActionOrMenu;
      children?: never;
    };

export type EmptySlotProps = {
  /** What the field does not have, for example "No blocks yet" */
  message: Message;
} & EmptySlotAction;

// Only for a field that holds objects (blocks, files, records). A field that
// holds a value that the user types shows its input.
const EmptySlot = (props: EmptySlotProps) => {
  const { tc } = useTranslation();
  if (props.action?.onClick) {
    const {
      message,
      action: { onClick, label, icon: Icon = Generic.AddIcon },
    } = props;

    return (
      <RawButton
        className="EmptySlot EmptySlot--with-actions"
        onClick={onClick}
      >
        <span className="EmptySlot__message">{tc(message)}</span>
        {/* Only a picture of a button: the slot is the button, and a
            button cannot be in a button */}
        <span className="EmptySlot__actions">
          <span className={buttonClassName({ tone: 'soft', size: 'micro' })}>
            {Icon && <Icon />}
            <span>{tc(label)}</span>
          </span>
        </span>
      </RawButton>
    );
  }

  const { message, action } = props;
  const children = action ? (
    <Dropdown
      triggerComponent={Dropdown.ButtonTrigger}
      label={action.label}
      icon={action.icon ?? Generic.AddIcon}
    >
      <Dropdown.Menu placement="bottom">{action.options}</Dropdown.Menu>
    </Dropdown>
  ) : (
    props.children
  );

  return (
    <div
      className={classNames('EmptySlot', {
        'EmptySlot--with-actions': children,
      })}
    >
      <div className="EmptySlot__message">{tc(message)}</div>
      {children && <div className="EmptySlot__actions">{children}</div>}
    </div>
  );
};

export default EmptySlot;
