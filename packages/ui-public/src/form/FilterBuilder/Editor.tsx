import React from 'react';
import { useTranslation } from '../../i18n';
import DebouncedTextInput from '../DebouncedTextInput';
import SelectInput from '../SelectInput';
import type { FilterEditor } from './types';

type EditorProps = {
  editor: FilterEditor;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled: boolean;
  readOnly: boolean;
  /** The name of the input for a screen reader */
  ariaLabel: string;
  /** The name of the field, for the names of the arguments of a group */
  fieldLabel: string;
};

const COMPLETE_NUMBER = /^-?\d+(\.\d+)?$/;

function formatNumber(value: unknown) {
  return typeof value === 'number' ? String(value) : '';
}

function formatList(value: unknown) {
  return Array.isArray(value) ? value.join(', ') : '';
}

function parseList(text: string | null) {
  return text ? text.split(/\s*,\s*/) : [];
}

function noop() {}

/** The input of the value of a condition */
export default function Editor({
  editor,
  value,
  onChange: onChangeProp,
  disabled,
  readOnly,
  ariaLabel,
  fieldLabel,
}: EditorProps) {
  const { t, tm } = useTranslation();
  // A read-only text input also calls onBlur. Thus a read-only editor
  // ignores each change.
  const onChange = readOnly ? noop : onChangeProp;

  // A text that is not a complete number ("-", "1.") does not change the
  // value, thus the input keeps what the user types
  const changeNumber = (text: string | null) => {
    const trimmed = (text ?? '').trim();
    if (trimmed === '') onChange(null);
    else if (COMPLETE_NUMBER.test(trimmed)) onChange(Number(trimmed));
  };

  switch (editor.type) {
    case 'none':
      return null;

    case 'text':
      return (
        <DebouncedTextInput
          autosize
          aria-label={ariaLabel}
          placeholder={editor.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={(text) => onChange(text ?? '')}
          onBlur={(text) => onChange(text ?? '')}
          disabled={disabled}
          readOnly={readOnly}
        />
      );

    case 'number':
      return (
        <DebouncedTextInput
          autosize
          inputMode="decimal"
          aria-label={ariaLabel}
          placeholder={editor.placeholder}
          value={formatNumber(value)}
          onChange={changeNumber}
          onBlur={changeNumber}
          disabled={disabled}
          readOnly={readOnly}
        />
      );

    case 'list':
      return (
        <DebouncedTextInput
          autosize
          aria-label={ariaLabel}
          placeholder={editor.placeholder}
          value={formatList(value)}
          onChange={(text) => onChange(parseList(text))}
          onBlur={(text) => onChange(parseList(text))}
          disabled={disabled}
          readOnly={readOnly}
        />
      );

    case 'select': {
      const options = editor.options.map((option) => ({
        value: option.value,
        label: tm(option.label),
      }));

      return editor.multiple ? (
        <SelectInput
          multiple
          autosize
          variant="filter"
          aria-label={ariaLabel}
          options={options}
          value={Array.isArray(value) ? value : []}
          onChange={(next) => onChange(next ?? [])}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : (
        <SelectInput
          autosize
          variant="filter"
          aria-label={ariaLabel}
          options={options}
          value={typeof value === 'string' ? value : null}
          onChange={(next) => onChange(next)}
          disabled={disabled}
          readOnly={readOnly}
        />
      );
    }

    case 'group': {
      const record =
        typeof value === 'object' && value !== null
          ? (value as Record<string, unknown>)
          : {};

      return (
        <>
          {editor.arguments.map((argument) => {
            const label = tm(argument.label);

            return (
              <span key={argument.id} className="FilterBuilder__argument">
                <span className="FilterBuilder__argument-label">{label}:</span>
                <Editor
                  editor={argument.editor}
                  value={record[argument.id]}
                  onChange={(next) =>
                    onChange({ ...record, [argument.id]: next })
                  }
                  disabled={disabled}
                  readOnly={readOnly}
                  ariaLabel={t('filterBuilder.argument', {
                    argument: label,
                    field: fieldLabel,
                  })}
                  fieldLabel={fieldLabel}
                />
              </span>
            );
          })}
        </>
      );
    }

    case 'custom':
      return (
        <>{editor.render({ value, onChange, disabled, readOnly, ariaLabel })}</>
      );
  }
}
