import React from 'react';
import { UI } from '../../icons/index';
import Button from '../actions/Button';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useTranslation } from '../i18n';

export type CopyButtonProps = {
  /** The text that the click copies. */
  value: string | null | undefined;
};

// Use CopyButton in the corner of a box (CodeSnippet) or at the end of a
// field (CopyableValue). See
// the "Copyable values" docs page (stories/Content/CopyableValues/CopyableValues.mdx).
function CopyButton({ value }: CopyButtonProps) {
  const { t } = useTranslation();
  const { copied, copy } = useCopyToClipboard(value);

  return (
    <Button
      tone="ghost"
      size="micro"
      iconOnly
      icon={copied ? UI.CheckIcon : UI.CopyIcon}
      label={copied ? t('clipboard.copied') : t('clipboard.copy')}
      onClick={copy}
    />
  );
}

export default React.memo(CopyButton);
