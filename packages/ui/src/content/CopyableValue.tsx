import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Generic } from '../../icons/index';
import Button from '../actions/Button';
import { useAutoincrementIntegerId } from '../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import CopyButton from './CopyButton';

/** The name of the field */
type CopyableValueName =
  /** A visible label above the field: CopyableValue draws the form field */
  | {
      /** The label above the field, for example "Webhook URL" */
      label: Message;
      /** A text under the field */
      hint?: Message;
      ariaLabel?: never;
    }
  /** No visible label, for example a link under a text that tells it */
  | {
      /** The name of the field for screen readers */
      ariaLabel: TextMessage;
      label?: never;
      hint?: never;
    };

export type CopyableValueProps = CopyableValueName & {
  /** The text to show and to copy, for example a webhook URL or a token. */
  value: string | null | undefined;
  /**
   * When the value is a URL that the user can visit, a second button opens
   * it in a new tab.
   */
  openable?: boolean;
  /**
   * When the value is code (a token, a key), the field uses the monospaced
   * font. A URL uses the regular font.
   */
  code?: boolean;
};

// See the "Copyable values" docs page (stories/Content/CopyableValues/CopyableValues.mdx)
function CopyableValue({
  value,
  openable,
  code,
  label,
  hint,
  ariaLabel,
}: CopyableValueProps) {
  const { tc, tm } = useTranslation();
  const id = `copyable-value-${useAutoincrementIntegerId()}`;

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      event.currentTarget.select();
    },
    [],
  );

  const box = (
    <div className="CopyableValue">
      <input
        id={id}
        aria-label={ariaLabel !== undefined ? tm(ariaLabel) : undefined}
        type="text"
        className={classNames(
          'CopyableValue__input',
          code && 'form__input--code',
        )}
        value={value ?? ''}
        readOnly
        onFocus={handleFocus}
      />
      <div className="CopyableValue__actions">
        <CopyButton value={value} />
        {openable && value && (
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={Generic.OpenInNewTabIcon}
            label={{ id: 'clipboard.open' }}
            newTab
            href={value}
          />
        )}
      </div>
    </div>
  );

  if (label === undefined) {
    return box;
  }

  return (
    <div className="form__field">
      <label className="form__label" htmlFor={id}>
        {tc(label)}
      </label>
      {box}
      {hint !== undefined && <div className="form__hint">{tc(hint)}</div>}
    </div>
  );
}

export default React.memo(CopyableValue);
