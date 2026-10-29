import React from 'react';
import { useAction } from '../actions/Actions/registry';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useTranslation } from '../i18n';
import Tooltip from '../overlays/Tooltip';
import RawButton from '../semantic/RawButton';
import IdText from './IdText';

export type CopyableIdProps = {
  /** The ID to show and to copy, for example "168342". */
  id: string;
  /**
   * The id of the action of the registry that copies the same ID: the
   * tooltip shows its keys. The click still copies the ID.
   */
  action?: string;
};

// Use CopyableId for an ID that is a value of its own (an info row, a column
// of a table). See the "Copyable values" docs page (stories/Content/CopyableValues/CopyableValues.mdx).
// The ID takes the color of the place: in a subtle place, it is subtle.
function CopyableId({ id, action: actionId }: CopyableIdProps) {
  const { t } = useTranslation();
  const action = useAction(actionId);
  const { copied, copy } = useCopyToClipboard(id);

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    copy();
  }

  if (!id) {
    return null;
  }

  return (
    <Tooltip
      label={copied ? t('clipboard.copied') : t('clipboard.copyId')}
      shortcut={action?.shortcuts}
      placement="bottom"
    >
      <RawButton
        className="CopyableId button--ghost-inline"
        onClick={handleClick}
      >
        <IdText id={id} />
      </RawButton>
    </Tooltip>
  );
}

export default React.memo(CopyableId);
