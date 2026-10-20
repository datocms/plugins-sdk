import classNames from 'classnames';
import React, {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Generic } from '../../icons/index';
import Button from '../actions/Button';
import { useAutoincrementIntegerId } from '../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../i18n';
import {
  DragHandle,
  SortableItem,
  type SortableItemApi,
  SortableList,
} from '../lists/dnd';
import EmptySlot from '../lists/EmptySlot';
import InsertGap, { insertGapListProps } from '../lists/InsertGap';
import { type Message, type TextMessage } from '../Message';
import FieldWrapper, { useFieldInput } from './FieldWrapper';

/** The props that a cell must give to its input. */
export type TableListInputProps = {
  /** The `id` of the input. */
  id: string;
  /** The classes of the input: the look of the cell. */
  className: string;
  /** The label of the column: the name of the input for a screen reader. */
  'aria-label': string;
  /** Set when the cell has an error. */
  'aria-invalid'?: true;
  /** The id of the error message under the list. */
  'aria-describedby'?: string;
  /** The list is disabled. */
  disabled: boolean;
};

/** What `render` gets for one cell. */
export type TableListCell<Item> = {
  /** The value of the row. */
  item: Item;
  /** The index of the row. */
  index: number;
  /**
   * The value of the cell: `item[field]`, or the row itself when the column
   * has no `field` or an empty `field`.
   */
  value: unknown;
  /** Call it with the new value of the cell. */
  onChange: (newValue: unknown) => void;
  /** Call it when the input loses the focus: the cell becomes touched. */
  onBlur: () => void;
  /** Give these props to the input of the cell. */
  inputProps: TableListInputProps;
};

/** One column of the list. */
export type TableListColumn<Item> = {
  /** A key that is unique in the list, for example "label". */
  id: string;
  /** The title of the column. It is also the name of the input. */
  label: TextMessage;
  /**
   * The part of the width that the column gets, in "fr".
   * @default 1
   */
  grow?: number;
  /**
   * The key of the value of the cell in the item, for example "label". An
   * empty string is the item itself. A column without a key shows no error
   * and does not become touched.
   */
  field?: string;
  /** The value is code: the input uses the monospaced font. */
  code?: boolean;
  /**
   * The content of the cell. Without it, the cell is a text input.
   */
  render?: (cell: TableListCell<Item>) => ReactNode;
};

/** An error with the key of its text, and the values of the text. */
export type TableListErrorId = {
  /** The key of the text of the error, for example "myPlugin.required". */
  id: string;
  /** The values of the text of the error. */
  values?: Record<string, string>;
};

/** One error: a text to show as it is, or an error id. */
export type TableListError = string | TableListErrorId;

/** The errors of one row: an error of the row, or the errors of its cells. */
export type TableListRowErrors =
  | TableListError
  | { [field: string]: TableListError | undefined };

/**
 * The errors of the list, in the shape of Formik and react-final-form: one
 * error of the whole list, or an array with the errors of each row.
 */
export type TableListErrors =
  | TableListError
  | (TableListRowErrors | undefined)[];

/** The touched state of one row: all the row, or each cell by its field. */
export type TableListRowTouched =
  | boolean
  | { [field: string]: boolean | undefined };

/**
 * The touched state of the list, in the shape of Formik and react-final-form:
 * `true` for all the cells, or an array with the touched state of each row.
 */
export type TableListTouched = boolean | (TableListRowTouched | undefined)[];

/** What changed in the list. The second argument of `onChange`. */
export type TableListChange =
  | {
      /** The user added a row at the end. */
      type: 'add';
    }
  | {
      /** The user removed the row at `index`. */
      type: 'remove';
      index: number;
    }
  | {
      /** The user dragged the row at `from` to `to`. */
      type: 'move';
      from: number;
      to: number;
    }
  | {
      /** The user changed a cell. `field` is "" when the cell is the row. */
      type: 'edit';
      index: number;
      field: string;
    };

/** The add button adds a `newItem` at once */
type TableListAddItem<Item> = {
  /** The label of the button that adds a row */
  label: TextMessage;
  /** Makes the value of a new row, for example `() => ({ label: '' })` */
  newItem: () => Item;
  options?: never;
};

/** The add button opens a menu: the user picks the kind of row to add */
type TableListAddMenu<Item> = {
  /** The label of the button that opens the menu */
  label: TextMessage;
  /**
   * Gives the `Dropdown.Option` elements of the menu. Each option calls
   * `addItem` with its row.
   */
  options: (addItem: (item: Item) => void) => ReactNode;
  newItem?: never;
};

/** The rows that the user cannot remove, and the reason */
export type TableListLocked<Item> = {
  /** Tells if a row is locked */
  isLocked: (item: Item) => boolean;
  /** The tooltip of the disabled trash of a locked row: it tells why */
  reason: TextMessage;
};

/** How the user adds a row: at once, or with a menu */
export type TableListAdd<Item> =
  | TableListAddItem<Item>
  | TableListAddMenu<Item>;

/**
 * The name of the group of rows, for a screen reader. Point to the visible
 * title of the list when it has one.
 */
export type TableListName =
  | {
      /** The `id` of the visible title of the list */
      'aria-labelledby': string;
      ariaLabel?: never;
    }
  | {
      /** The name of the list, when it has no visible title */
      ariaLabel: TextMessage;
      'aria-labelledby'?: never;
    }
  /** The list is in a `FieldWrapper` with a `label`: the label names it */
  | {
      ariaLabel?: never;
      'aria-labelledby'?: never;
    };

/** The value of a list input and its state: the controlled props. */
export type ListInputValueProps<Item> = {
  /** The rows of the list. */
  value: Item[];
  /**
   * Called with the new rows when the user adds, removes, moves or changes a
   * row. The second argument tells what changed.
   */
  onChange: (items: Item[], change: TableListChange) => void;
  /**
   * The errors of the list. An error of a cell shows when the cell is
   * touched, an error of the list shows when `touched` is set.
   */
  errors?: TableListErrors;
  /** The cells that the user touched. */
  touched?: TableListTouched;
  /** Called when a cell with a `field` loses the focus. */
  onCellBlur?: (cell: { index: number; field: string }) => void;
  /** The user cannot change the list. */
  disabled?: boolean;
  /**
   * The `id` of the group element around the list. In a `FieldWrapper`, the
   * list gets the `id` of the field.
   */
  id?: string;
};

/** The props of a `TableList` that are not its value and its state. */
export type TableListOptions<Item> = {
  /** The columns of the list. Wrap them in `useMemo`. */
  columns: TableListColumn<Item>[];
  /** The text of the list when it has no row. */
  emptyMessage: Message;
  /**
   * The button that adds a row. Without it, the user cannot add a row (for
   * example when all the kinds of rows are in the list).
   */
  add?: TableListAdd<Item>;
  /** The user can drag the rows to change their order. */
  sortable?: boolean;
  /**
   * Runs when the user clicks the trash of a row. Use it to ask for a
   * confirm first: call `remove` to remove the row. Without it, the row
   * goes out of the list at once.
   */
  onRemove?: (index: number, item: Item, remove: () => void) => void;
  /** Some rows are locked: the user cannot remove them. */
  locked?: TableListLocked<Item>;
};

export type TableListProps<Item> = ListInputValueProps<Item> &
  TableListName &
  TableListOptions<Item>;

function errorKey(error: TableListError) {
  return typeof error === 'string' ? error : error.id;
}

function isError(error: unknown): error is TableListError {
  return (
    typeof error === 'string' ||
    (typeof error === 'object' &&
      error !== null &&
      typeof (error as TableListErrorId).id === 'string')
  );
}

function cellValue<Item>(item: Item, field: string | undefined): unknown {
  return field ? (item as Record<string, unknown>)?.[field] : item;
}

function isCellTouched(
  touched: TableListTouched | undefined,
  index: number,
  field: string,
) {
  if (!Array.isArray(touched)) {
    return Boolean(touched);
  }

  const row = touched[index];

  if (field === '' || typeof row !== 'object') {
    return Boolean(row);
  }

  return Boolean(row[field]);
}

function TableList<Item>({
  value: items,
  onChange,
  errors,
  touched,
  onCellBlur,
  disabled = false,
  id,
  columns,
  emptyMessage,
  add,
  sortable,
  onRemove,
  locked: lockedRows,
  'aria-labelledby': ariaLabelledBy,
  ariaLabel,
}: TableListProps<Item>) {
  const { tm, tc } = useTranslation();
  // The group element takes the field. A group has no invalid or required
  // state: the cells have their own.
  const field = useFieldInput({ id, 'aria-labelledby': ariaLabelledBy });

  const groupProps = {
    id: field.id,
    role: 'group',
    'aria-labelledby': ariaLabel ? undefined : field['aria-labelledby'],
    'aria-label': ariaLabel ? tm(ariaLabel) : undefined,
    'aria-describedby': field['aria-describedby'],
  };
  const listRef = useRef<HTMLDivElement>(null);
  const focusNewRowRef = useRef(false);
  const uid = useAutoincrementIntegerId();

  // Two changes in the same event must not lose the first one
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const messageDomId = (errorId: string) => `TableList-${uid}-error-${errorId}`;

  const change = useCallback((newItems: Item[], what: TableListChange) => {
    itemsRef.current = newItems;
    onChangeRef.current(newItems, what);
  }, []);

  const pushItem = useCallback(
    (item: Item) => change([...itemsRef.current, item], { type: 'add' }),
    [change],
  );

  const newItem = add?.newItem;

  const addItem = useCallback(() => {
    if (!newItem) {
      return;
    }

    focusNewRowRef.current = true;
    pushItem(newItem());
  }, [pushItem, newItem]);

  const removeItem = useCallback(
    (index: number) =>
      change(
        itemsRef.current.filter((_item, i) => i !== index),
        { type: 'remove', index },
      ),
    [change],
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      const newItems = [...itemsRef.current];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(to, 0, moved);
      change(newItems, { type: 'move', from, to });
    },
    [change],
  );

  const editCell = (index: number, field: string, newValue: unknown) => {
    const newItems = [...itemsRef.current];
    newItems[index] = field
      ? ({ ...newItems[index], [field]: newValue } as Item)
      : (newValue as Item);
    change(newItems, { type: 'edit', index, field });
  };

  useEffect(() => {
    if (!focusNewRowRef.current) {
      return;
    }

    focusNewRowRef.current = false;

    const rows = listRef.current?.querySelectorAll('.TableList__row');
    const lastRow = rows?.[rows.length - 1];

    lastRow?.querySelector<HTMLInputElement>('input')?.focus();
  });

  const listError =
    touched && errors !== undefined && !Array.isArray(errors) && isError(errors)
      ? errors
      : undefined;

  const listErrorElement = listError && (
    <div className="form__error">
      {typeof listError === 'string'
        ? listError
        : tc({ id: listError.id, values: listError.values })}
    </div>
  );

  const errorOfCell = (
    index: number,
    column: TableListColumn<Item>,
  ): TableListError | undefined => {
    if (column.field == null || !Array.isArray(errors)) {
      return undefined;
    }

    const rowError = errors[index];
    const cellError =
      column.field === ''
        ? rowError
        : typeof rowError === 'object'
          ? (rowError as Record<string, unknown>)[column.field]
          : undefined;

    if (!isError(cellError) || !isCellTouched(touched, index, column.field)) {
      return undefined;
    }

    return cellError;
  };

  const addMenu = add?.options ? add.options(pushItem) : undefined;

  if (items.length === 0) {
    return (
      <div {...groupProps}>
        <FieldWrapper.Boundary>
          {listErrorElement}
          {disabled || !add ? (
            <EmptySlot message={emptyMessage} />
          ) : addMenu ? (
            <EmptySlot
              message={emptyMessage}
              action={{ label: add.label, options: addMenu }}
            />
          ) : (
            <EmptySlot
              message={emptyMessage}
              action={{ label: add.label, onClick: addItem }}
            />
          )}
        </FieldWrapper.Boundary>
      </div>
    );
  }

  // One message for each kind of error, not one for each cell
  const messages = new Map<string, TableListError>();

  items.forEach((_item, index) => {
    for (const column of columns) {
      const cellError = errorOfCell(index, column);

      if (cellError) {
        messages.set(errorKey(cellError), cellError);
      }
    }
  });

  const style = {
    '--TableList-columns': columns
      .map((column) => `minmax(0, ${column.grow ?? 1}fr)`)
      .join(' '),
  } as CSSProperties;

  const renderRow = (
    item: Item,
    index: number,
    sortableProps?: SortableItemApi,
  ) => {
    const locked = lockedRows?.isLocked(item) ?? false;

    return (
      <div
        className={classNames('TableList__row', {
          'is-dragging': sortableProps?.isDragging,
        })}
        key={index}
        ref={sortableProps?.ref}
      >
        {columns.map((column) => {
          const cellError = errorOfCell(index, column);
          const field = column.field;
          const inputProps: TableListInputProps = {
            id: `TableList-${uid}-${index}-${column.id}`,
            className: classNames('TableList__input', {
              'form__input--code': column.code,
            }),
            'aria-label': tm(column.label),
            'aria-invalid': cellError ? true : undefined,
            'aria-describedby': cellError
              ? messageDomId(errorKey(cellError))
              : undefined,
            disabled,
          };
          const value = cellValue(item, field);
          const onCellChange = (newValue: unknown) =>
            editCell(index, field ?? '', newValue);
          const onBlur = () => {
            if (field != null) {
              onCellBlur?.({ index, field });
            }
          };

          return (
            <div
              key={column.id}
              className={classNames('TableList__cell', {
                'is-invalid': cellError,
              })}
            >
              {column.render ? (
                column.render({
                  item,
                  index,
                  value,
                  onChange: onCellChange,
                  onBlur,
                  inputProps,
                })
              ) : (
                <input
                  type="text"
                  {...inputProps}
                  value={value == null ? '' : String(value)}
                  onChange={(event) => onCellChange(event.target.value)}
                  onBlur={onBlur}
                />
              )}
            </div>
          );
        })}
        <div className="TableList__cell TableList__cell--action">
          {!disabled && lockedRows && locked && (
            <Button
              tone="ghost-alert"
              size="micro"
              iconOnly
              icon={Generic.DeleteIcon}
              label={{ id: 'tableList.removeRow' }}
              className="TableList__remove"
              disabled={{ reason: lockedRows.reason }}
            />
          )}
          {!disabled && !locked && (
            <Button
              tone="ghost-alert"
              size="micro"
              iconOnly
              icon={Generic.DeleteIcon}
              label={{ id: 'tableList.removeRow' }}
              className="TableList__remove"
              onClick={() => {
                if (onRemove) {
                  onRemove(index, item, () => removeItem(index));
                } else {
                  removeItem(index);
                }
              }}
            />
          )}
        </div>
        {/* After the cells: the CSS finds the first cell with ":first-child" */}
        {sortableProps && !disabled && (
          <DragHandle
            ref={sortableProps.handleRef}
            gutter="normal"
            className="TableList__handle"
          />
        )}
        {sortableProps?.dropIndicator}
      </div>
    );
  };

  const rows = sortable ? (
    <SortableList
      disabled={disabled}
      onDrop={({ source, destination }) => {
        moveItem(source.index, destination.index);
      }}
    >
      <div className="TableList__body">
        {items.map((item, index) => (
          <SortableItem
            // biome-ignore lint/suspicious/noArrayIndexKey: the rows have no id of their own
            key={index}
            id={`TableList-${uid}-${index}`}
            index={index}
            handle={true}
          >
            {(api) => renderRow(item, index, api)}
          </SortableItem>
        ))}
      </div>
    </SortableList>
  ) : (
    <div className="TableList__body">
      {items.map((item, index) => renderRow(item, index))}
    </div>
  );

  return (
    <div {...groupProps}>
      <FieldWrapper.Boundary>
        {listErrorElement}
        <div
          className={classNames('TableList', {
            'TableList--disabled': disabled,
          })}
          style={style}
          ref={listRef}
          {...insertGapListProps}
        >
          <div className="TableList__head">
            {columns.map((column) => (
              <div className="TableList__head-cell" key={column.id}>
                {tm(column.label)}
              </div>
            ))}
            <div className="TableList__head-cell TableList__head-cell--action" />
          </div>
          {rows}
          {!disabled &&
            add &&
            (addMenu ? (
              <InsertGap position="after" label={add.label}>
                {addMenu}
              </InsertGap>
            ) : (
              <InsertGap
                position="after"
                label={add.label}
                onTrigger={addItem}
              />
            ))}
        </div>
        {[...messages.values()].map((message) => {
          const key = errorKey(message);

          return (
            <div
              className="form__error"
              key={key}
              id={messageDomId(key)}
              role="alert"
            >
              {typeof message === 'string'
                ? message
                : tc({ id: message.id, values: message.values })}
            </div>
          );
        })}
      </FieldWrapper.Boundary>
    </div>
  );
}

export default React.memo(TableList) as typeof TableList;
