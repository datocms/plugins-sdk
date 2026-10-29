import React from 'react';
import { Generic } from '../../../icons';
import { Dropdown } from '../../actions/Dropdown';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';
import { useNavigation } from '../NavigationProvider';

export type SidebarTreeNodeActionsProps = {
  /** The page of the "edit" option: the path with its query */
  editTo: string;
  /** The text of the "edit" option */
  editLabel: Message;
  /** The text of the "delete" option */
  deleteLabel: Message;
  /** Runs when the user picks the "delete" option */
  onDelete: () => void;
  /**
   * The option that starts the edit mode of the tree, where the user
   * reorders the items. Do not give it in edit mode.
   */
  onReorder?: () => void;
  /** The option that adds an item inside the node */
  add?: {
    /** The text of the option */
    label: Message;
    /** Runs when the user picks the option */
    onAdd: () => void;
  };
};

/**
 * The ⋮ menu of a node. Give it to the "actions" prop of SidebarTree.Node.
 */
function SidebarTreeNodeActions({
  editTo,
  editLabel,
  deleteLabel,
  onDelete,
  onReorder,
  add,
}: SidebarTreeNodeActionsProps) {
  const { t, tc } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <Dropdown
      triggerComponent={Dropdown.IconTrigger}
      icon={Generic.ActionToggleIcon}
      className="SidebarTree__node__actions"
    >
      <Dropdown.Menu>
        {add && (
          <Dropdown.Option
            onPick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              add.onAdd();
            }}
            icon={<Generic.AddIcon />}
          >
            <span>{tc(add.label)}</span>
          </Dropdown.Option>
        )}
        <Dropdown.Option
          onPick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            navigate(editTo);
          }}
          icon={<Generic.EditIcon />}
        >
          <span>{tc(editLabel)}</span>
        </Dropdown.Option>
        {onReorder && (
          <Dropdown.Option
            onPick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onReorder();
            }}
            icon={<Generic.ReorderIcon />}
          >
            <span>{t('sidebarEditMode.reorder')}</span>
          </Dropdown.Option>
        )}
        <Dropdown.Separator />
        <Dropdown.Option
          alert={true}
          onPick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
          icon={<Generic.DeleteIcon />}
        >
          <span>{tc(deleteLabel)}</span>
        </Dropdown.Option>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default React.memo(SidebarTreeNodeActions);
