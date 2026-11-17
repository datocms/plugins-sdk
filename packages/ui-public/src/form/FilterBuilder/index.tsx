import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createFilter } from 'react-select';
import { Generic, UI } from '../../../icons/index';
import Button from '../../actions/Button';
import { Dropdown } from '../../actions/Dropdown';
import { useTranslation } from '../../i18n';
import { InSearchContext } from '../../layout/Toolbar/context';
import FieldWrapper, { useFieldInput } from '../FieldWrapper';
import { type EditState, getEditState } from '../getEditState';
import SelectInput from '../SelectInput';
import Editor from './Editor';
import type {
  FilterBuilderProps,
  FilterCondition,
  FilterField,
  FilterOperator,
} from './types';
import {
  carriedValue,
  defaultValueOf,
  freeOperators,
  newCondition,
  type Uniqueness,
} from './values';

export type {
  FilterArgument,
  FilterBuilderProps,
  FilterCondition,
  FilterCustomEditor,
  FilterEditor,
  FilterEditorRenderProps,
  FilterField,
  FilterGroupEditor,
  FilterNoneEditor,
  FilterOperator,
  FilterSelectEditor,
  FilterSelectOption,
  FilterTextEditor,
} from './types';

const defaultFilterOption = createFilter<{ label: string; value: string }>();

type TileProps = {
  condition: FilterCondition;
  field: FilterField;
  fields: FilterField[];
  /** The other conditions of the filter */
  others: FilterCondition[];
  uniqueness: Uniqueness;
  edit: EditState;
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
};

/** The name of a field in a menu, with its code after it */
function FieldName({ label, code }: { label: string; code?: string }) {
  return code ? (
    // The space keeps the label and the code apart for a screen reader and
    // for the search of a select
    <>
      {label} <code>{code}</code>
    </>
  ) : (
    // The fragment makes a JSX element: the types of React 17 refuse a
    // component that returns a string
    // biome-ignore lint/complexity/noUselessFragments: see above
    <>{label}</>
  );
}

/**
 * A field with one operator shows it as text: a select with one option
 * looks like a choice that the user does not have.
 */
function hasOnlyOperator(field: FilterField, operator: FilterOperator) {
  const visible = field.operators.filter((other) => !other.deprecated);
  return visible.length === 1 && visible[0] === operator;
}

function Tile({
  condition,
  field,
  fields,
  others,
  uniqueness,
  edit,
  onChange,
  onRemove,
}: TileProps) {
  const { disabled, showsReadOnly: readOnly, locked } = edit;
  const { t, tm } = useTranslation();
  const fieldLabel = tm(field.label);
  const operator = field.operators.find((op) => op.id === condition.operator);

  const fieldOptions = fields
    .filter(
      (other) =>
        other.id === field.id ||
        freeOperators(other, others, uniqueness).length > 0,
    )
    .map((other) => ({
      value: other.id,
      label: tm(other.label),
      code: other.code ? tm(other.code) : undefined,
    }));

  const free = freeOperators(field, others, uniqueness);
  const operatorOptions = field.operators
    .filter((op) => op.id === condition.operator || free.includes(op))
    .map((op) => ({ value: op.id, label: tm(op.label) }));
  const deprecatedIds = field.operators
    .filter((op) => op.deprecated)
    .map((op) => op.id);

  const handleFieldChange = (fieldId: string | null) => {
    if (!fieldId || fieldId === field.id) return;
    const nextField = fields.find((other) => other.id === fieldId);
    const next = nextField && newCondition(nextField, others, uniqueness);
    if (next) onChange(next);
  };

  const handleOperatorChange = (operatorId: string | null) => {
    const nextOperator = field.operators.find((op) => op.id === operatorId);
    if (!nextOperator || nextOperator === operator) return;

    onChange({
      field: field.id,
      operator: nextOperator.id,
      value: operator
        ? carriedValue(operator.editor, nextOperator.editor, condition.value)
        : defaultValueOf(nextOperator.editor),
    });
  };

  // The name of the group gives the operator to a screen reader, also when
  // the operator is static text that the focus does not reach
  return (
    <div
      className="FilterBuilder__tile"
      role="group"
      aria-label={t('filterBuilder.condition', {
        field: fieldLabel,
        operator: operator ? tm(operator.label) : '',
      })}
    >
      <SelectInput
        autosize
        variant="filter-field"
        className="FilterBuilder__field"
        aria-label={t('filterBuilder.field')}
        options={fieldOptions}
        value={field.id}
        onChange={handleFieldChange}
        disabled={disabled}
        readOnly={readOnly}
        maxMenuHeight={275}
        formatOptionLabel={(option, { context }) =>
          context === 'menu' ? (
            <FieldName label={option.label} code={option.code} />
          ) : (
            option.label
          )
        }
      />
      {operator && hasOnlyOperator(field, operator) ? (
        <span className="FilterBuilder__operator FilterBuilder__operator--static">
          {tm(operator.label)}
        </span>
      ) : (
        <SelectInput
          autosize
          variant="filter"
          className="FilterBuilder__operator"
          aria-label={t('filterBuilder.operator', { field: fieldLabel })}
          options={operatorOptions}
          filterOption={(option, input) =>
            !deprecatedIds.includes(option.value) &&
            defaultFilterOption(option, input)
          }
          value={operator ? operator.id : null}
          onChange={handleOperatorChange}
          disabled={disabled}
          readOnly={readOnly}
          maxMenuHeight={275}
        />
      )}
      {operator && operator.editor.type !== 'none' && (
        <div className="FilterBuilder__value">
          <Editor
            editor={operator.editor}
            value={condition.value}
            onChange={(value) => onChange({ ...condition, value })}
            disabled={disabled}
            readOnly={readOnly}
            ariaLabel={t('filterBuilder.value', { field: fieldLabel })}
            fieldLabel={fieldLabel}
          />
        </div>
      )}
      {!readOnly && (
        <Button
          tone="ghost"
          size="micro"
          iconOnly
          icon={Generic.CloseIcon}
          label={{ id: 'filterBuilder.remove', values: { field: fieldLabel } }}
          onClick={onRemove}
          disabled={locked}
          className="FilterBuilder__remove"
        />
      )}
    </div>
  );
}

/**
 * After the user removes a condition, the focus goes to the remove button
 * of the next tile, or to the "+" button when no tile is left. Without it,
 * the focus goes to the page, because the button that had it is gone.
 */
function useFocusAfterRemove(count: number) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const removedIndex = useRef<number | null>(null);

  useEffect(() => {
    const index = removedIndex.current;
    const root = rootRef.current;
    removedIndex.current = null;
    if (index === null || !root) return;

    const removeButtons = root.querySelectorAll<HTMLElement>(
      '.FilterBuilder__remove',
    );
    const target =
      removeButtons[Math.min(index, removeButtons.length - 1)] ??
      root.querySelector<HTMLElement>('.FilterBuilder__add button');
    target?.focus();
  }, [count]);

  return {
    rootRef,
    onRemove: (index: number) => {
      removedIndex.current = index;
    },
  };
}

type TileKeys = { value: FilterCondition[]; keys: string[] };

let lastTileKey = 0;
const newTileKey = () => `tile-${++lastTileKey}`;

/**
 * Gives to each new condition the key of the old condition with the same
 * field and operator. A condition that changed its field or operator in place
 * keeps the key of its index, when the count of the conditions is the same.
 */
function matchTileKeys(previous: TileKeys, value: FilterCondition[]): string[] {
  const used = new Set<number>();
  const sameCount = previous.value.length === value.length;

  return value.map((condition, index) => {
    let match = previous.value.findIndex(
      (old, i) =>
        !used.has(i) &&
        old.field === condition.field &&
        old.operator === condition.operator,
    );
    if (match === -1 && sameCount && !used.has(index)) match = index;
    if (match === -1) return newTileKey();
    used.add(match);
    return previous.keys[match];
  });
}

/**
 * A key for each tile. The conditions have no id, and an index key gives the
 * editor of a removed tile to the next tile: a text editor that waits for a
 * pause then writes into the wrong condition.
 */
function useTileKeys(value: FilterCondition[]): string[] {
  const [known, setKnown] = useState<TileKeys>(() => ({
    value,
    keys: value.map(newTileKey),
  }));

  if (known.value === value) return known.keys;

  const keys = matchTileKeys(known, value);
  setKnown({ value, keys });
  return keys;
}

/**
 * The conditions of a filter, as tiles: a field, an operator and a value.
 * It is controlled: it has no copy of the conditions.
 */
function FilterBuilder({
  fields,
  value,
  onChange,
  disabled,
  readOnly,
  emptyLabel,
  oneConditionPerField = false,
}: FilterBuilderProps) {
  const { tc, tm } = useTranslation();
  const inSearch = useContext(InSearchContext);
  // A group has no invalid or required state: take only the name and the
  // description of the field
  const field = useFieldInput({});
  const uniqueness: Uniqueness = oneConditionPerField ? 'field' : 'operator';
  const edit = getEditState({ disabled, readOnly });

  const addable = fields.filter(
    (candidate) => freeOperators(candidate, value, uniqueness).length > 0,
  );

  const focus = useFocusAfterRemove(value.length);
  const tileKeys = useTileKeys(value);

  const replace = (index: number, condition: FilterCondition) =>
    onChange(value.map((other, i) => (i === index ? condition : other)));

  const remove = (index: number) => {
    focus.onRemove(index);
    onChange(value.filter((_, i) => i !== index));
  };

  const clear = () => {
    focus.onRemove(0);
    onChange([]);
  };

  const add = (candidate: FilterField) => {
    const condition = newCondition(candidate, value, uniqueness);
    if (condition) onChange([...value, condition]);
  };

  return (
    <div
      ref={focus.rootRef}
      className={classNames('FilterBuilder', edit.stateClass)}
      role="group"
      id={field.id}
      aria-labelledby={field['aria-labelledby']}
      aria-describedby={field['aria-describedby']}
    >
      {inSearch && (
        <span className="FilterBuilder__icon" aria-hidden="true">
          <UI.FilterIcon />
        </span>
      )}
      <FieldWrapper.Boundary>
        <div className="FilterBuilder__box">
          {value.map((condition, index) => {
            const conditionField = fields.find(
              (candidate) => candidate.id === condition.field,
            );

            if (!conditionField) return null;

            return (
              <Tile
                key={tileKeys[index]}
                condition={condition}
                field={conditionField}
                fields={fields}
                others={value.filter((_, i) => i !== index)}
                uniqueness={uniqueness}
                edit={edit}
                onChange={(next) => replace(index, next)}
                onRemove={() => remove(index)}
              />
            );
          })}
          {value.length === 0 && (
            <span className="FilterBuilder__empty">
              {tc(emptyLabel ?? { id: 'filterBuilder.empty' })}
            </span>
          )}
          {!edit.showsReadOnly && (
            <Dropdown
              triggerComponent={Dropdown.ButtonTrigger}
              size="micro"
              iconOnly
              icon={Generic.AddIcon}
              label={{ id: 'filterBuilder.add' }}
              disabled={edit.locked || addable.length === 0}
              className="FilterBuilder__add"
            >
              <Dropdown.Menu placement="bottom-start" minWidth={220}>
                <Dropdown.Group name={{ id: 'filterBuilder.addMenu' }}>
                  {addable.map((candidate) => (
                    <Dropdown.Option
                      key={candidate.id}
                      onPick={() => add(candidate)}
                    >
                      <FieldName
                        label={tm(candidate.label)}
                        code={candidate.code ? tm(candidate.code) : undefined}
                      />
                    </Dropdown.Option>
                  ))}
                </Dropdown.Group>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        {value.length > 0 && !edit.showsReadOnly && (
          <span className="FilterBuilder__clear">
            <Button
              tone="ghost"
              size="micro"
              iconOnly
              icon={Generic.CloseIcon}
              label={{ id: 'filterBuilder.clear' }}
              onClick={clear}
              disabled={edit.locked}
            />
          </span>
        )}
      </FieldWrapper.Boundary>
    </div>
  );
}

export default FilterBuilder;
