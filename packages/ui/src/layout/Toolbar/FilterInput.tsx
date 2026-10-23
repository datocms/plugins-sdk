import cn from 'classnames';
import React, { useContext } from 'react';
import { Generic } from '../../../icons/index';
import Button from '../../actions/Button';
import DebouncedTextInput from '../../form/DebouncedTextInput';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Search from '../../semantic/Search';
import { usePaneAriaLabel } from '../Pane/PaneAriaLabel';
import { InSearchContext } from './context';

export type FilterInputProps = {
  /** The text of the filter */
  value: string;
  /** Runs when the user changes the text */
  onChange: (value: string) => void;
  /**
   * The name of the search landmark: what the field filters. Without it,
   * the ariaLabel of the Pane. In a Toolbar.Search, the filter has no
   * landmark of its own and does not use it.
   */
  ariaLabel?: TextMessage;
  /**
   * The field gets the focus when it shows
   * @default true
   */
  autoFocus?: boolean;
  /**
   * "onChange" runs a moment after the user stops to type
   * @default false
   */
  debounce?: boolean;
  /** The field cannot change */
  disabled?: boolean;
  /**
   * When it is set, the "✕" button is always visible. It clears the
   * filter, then it calls this function (for example, to close the filter).
   */
  onClose?: () => void;
};

/** The magnifier, the field and the "✕" of the filter, without a landmark */
function FilterParts({
  value,
  onChange,
  autoFocus = true,
  debounce = false,
  disabled = false,
  onClose,
}: Omit<FilterInputProps, 'ariaLabel'>) {
  const { t } = useTranslation();
  const placeholder = t('fullTextQuery.placeholder');

  const handleChange = (newValue: string | null) => {
    onChange(newValue ?? '');
  };

  return (
    <>
      <span
        className={cn('Toolbar__filter__icon', {
          'Toolbar__filter__icon--disabled': disabled,
        })}
      >
        <Generic.SearchIcon />
      </span>
      {debounce ? (
        <DebouncedTextInput
          autoFocus={autoFocus}
          name="fullTextQuery"
          type="text"
          aria-label={placeholder}
          placeholder={placeholder}
          className="Toolbar__filter__input"
          value={value || null}
          onChange={handleChange}
          onBlur={handleChange}
          disabled={disabled}
        />
      ) : (
        <input
          autoFocus={autoFocus}
          name="fullTextQuery"
          type="text"
          aria-label={placeholder}
          placeholder={placeholder}
          className="Toolbar__filter__input"
          value={value}
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
      )}
      {(onClose || value) && !disabled && (
        <Button
          tone="ghost"
          size="micro"
          iconOnly
          icon={Generic.CloseIcon}
          label={{
            id: onClose ? 'fullTextQuery.close' : 'field.clearValue',
          }}
          onClick={() => {
            onChange('');
            onClose?.();
          }}
        />
      )}
    </>
  );
}

/**
 * The text filter of a list, with a magnifier and a "✕" that clears it. It is
 * a search landmark, except in a Toolbar.Search (the text cell of a form).
 */
function FilterInput({ ariaLabel, ...props }: FilterInputProps) {
  const { tm } = useTranslation();
  const paneAriaLabel = usePaneAriaLabel();
  const inSearch = useContext(InSearchContext);

  if (inSearch) {
    return (
      <div className="Toolbar__filter">
        <FilterParts {...props} />
      </div>
    );
  }

  return (
    <Search
      ariaLabel={ariaLabel ? tm(ariaLabel) : paneAriaLabel}
      className="Toolbar__filter"
    >
      <FilterParts {...props} />
    </Search>
  );
}

export default React.memo(FilterInput);
