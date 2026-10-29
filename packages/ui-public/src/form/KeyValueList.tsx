import React, { useCallback, useMemo } from 'react';
import type { Message, TextMessage } from '../Message';
import localeDirection from '../utils/localeDirection';
import TableList, {
  type ListInputValueProps,
  type TableListCell,
  type TableListColumn,
  type TableListName,
} from './TableList';

/** An object with any keys, for example the custom data of an asset. */
export type GenericObject = {
  [key: string]: unknown;
};

/** One row of the list: a key and its value. */
export type Tuple = {
  key: string;
  value: unknown;
};

/** The pairs that a default gives, and why their rows are locked */
export type KeyValueListDefaults = {
  /** The pairs of the default */
  values: GenericObject;
  /**
   * The tooltip of the disabled trash of a default row, for example "This
   * pair comes from the default metadata"
   */
  lockedReason: TextMessage;
};

/** The texts of a KeyValueList, already translated or as `{ id }` */
export type KeyValueListTexts = {
  /** The title of the key column, for example "Header" */
  key: TextMessage;
  /**
   * The title of the value column
   * @default "Value"
   */
  value?: TextMessage;
  /** The label of the button that adds a row, for example "Add header" */
  add: TextMessage;
  /** The text of the list when it has no row, for example "No headers" */
  empty: Message;
};

/** The props of a `KeyValueList` that are not its value and its state. */
export type KeyValueListOptions = {
  /** The texts of the list. Give a constant, thus the columns stay the same. */
  texts: KeyValueListTexts;
  /**
   * The language of the values, as a locale code, for example "it". The
   * inputs get it as the `lang` attribute, and get their `dir` from it.
   */
  locale?: string;
  /**
   * The pairs that a default gives, for example the custom data of all the
   * assets. A row with one of these keys is locked: the key cannot change,
   * the default value is the placeholder of the value, and the user cannot
   * remove the row.
   */
  defaults?: KeyValueListDefaults;
};

export type KeyValueListProps = ListInputValueProps<Tuple> &
  TableListName &
  KeyValueListOptions;

const KeyValueList = ({
  texts,
  locale,
  defaults,
  ...props
}: KeyValueListProps) => {
  const isLocked = useCallback(
    (item: Tuple) =>
      Boolean(defaults && item.key != null && defaults.values[item.key]),
    [defaults],
  );

  const columns = useMemo<TableListColumn<Tuple>[]>(
    () => [
      {
        id: 'key',
        field: 'key',
        label: texts.key,
        grow: 2,
        code: true,
        render: (cell) => (
          <TextCell
            cell={cell}
            disabled={cell.inputProps.disabled || isLocked(cell.item)}
            locale={locale}
          />
        ),
      },
      {
        id: 'value',
        field: 'value',
        label: texts.value ?? { id: 'keyValueList.value' },
        grow: 3,
        render: (cell) => (
          <TextCell
            cell={cell}
            placeholder={
              defaults && isLocked(cell.item)
                ? String(defaults.values[cell.item.key])
                : ''
            }
            locale={locale}
          />
        ),
      },
    ],
    [texts, isLocked, defaults, locale],
  );

  return (
    <TableList<Tuple>
      {...props}
      columns={columns}
      emptyMessage={texts.empty}
      add={{ label: texts.add, newItem: newTuple }}
      locked={
        defaults ? { isLocked, reason: defaults.lockedReason } : undefined
      }
    />
  );
};

/** A text input in a cell, with the language of the values */
function TextCell({
  cell: { value, onChange, onBlur, inputProps },
  disabled,
  placeholder,
  locale,
}: {
  cell: TableListCell<Tuple>;
  disabled?: boolean;
  placeholder?: string;
  locale?: string;
}) {
  return (
    <input
      type="text"
      {...inputProps}
      disabled={disabled ?? inputProps.disabled}
      value={value == null ? '' : String(value)}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      lang={locale}
      dir={locale ? localeDirection(locale) : undefined}
    />
  );
}

const newTuple = () => ({ key: null, value: null }) as unknown as Tuple;

export default React.memo(KeyValueList);

/** Makes the rows of the list from an object. */
export function deserialize(obj: GenericObject | null): Tuple[] {
  return Object.entries(obj || {}).map(([key, value]) => ({ key, value }));
}

/** Makes an object from the rows of the list. */
export function serialize(obj: Tuple[]): GenericObject {
  return obj.reduce(
    (acc, { key, value: v }) => Object.assign(acc, { [key]: v }),
    {},
  );
}
