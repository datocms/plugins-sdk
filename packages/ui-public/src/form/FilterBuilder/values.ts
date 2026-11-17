import type {
  FilterCondition,
  FilterEditor,
  FilterField,
  FilterOperator,
  FilterSelectEditor,
} from './types';

/**
 * The value of a new condition, and the value after a change of operator
 * that cannot keep the old value
 */
export function defaultValueOf(editor: FilterEditor): unknown {
  switch (editor.type) {
    case 'none':
    case 'number':
      return null;
    case 'text':
      return '';
    case 'list':
      return [];
    case 'select':
      return editor.defaultValue ?? (editor.multiple ? [] : null);
    case 'group':
      return Object.fromEntries(
        editor.arguments.map((argument) => [
          argument.id,
          defaultValueOf(argument.editor),
        ]),
      );
    case 'custom':
      return editor.defaultValue;
  }
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '';
}

// A single value becomes a list of one value, and a list becomes its first
// value. The editors of the two operators decide which change applies.
function changeArity(
  value: unknown,
  wasMultiple: boolean,
  isMultiple: boolean,
  keep: (candidate: unknown) => boolean,
  fallback: unknown,
) {
  if (wasMultiple && isMultiple) {
    return Array.isArray(value) ? value.filter(keep) : fallback;
  }

  if (isMultiple) {
    return isEmpty(value) || !keep(value) ? fallback : [value];
  }

  if (wasMultiple) {
    const first = Array.isArray(value) ? value.find(keep) : undefined;
    return first === undefined ? fallback : first;
  }

  return isEmpty(value) || !keep(value) ? fallback : value;
}

function offeredBy(editor: FilterSelectEditor) {
  return (candidate: unknown) =>
    typeof candidate === 'string' &&
    editor.options.some((option) => option.value === candidate);
}

function anyValue() {
  return true;
}

function sameArguments(
  prev: FilterEditor & { type: 'group' },
  next: FilterEditor & { type: 'group' },
) {
  return (
    prev.arguments.length === next.arguments.length &&
    next.arguments.every((argument) =>
      prev.arguments.some((other) => other.id === argument.id),
    )
  );
}

/**
 * The value that a condition keeps when the user changes its operator. The
 * operator changes how the field matches, not what it matches. Thus the
 * value stays when the two editors take the same kind of value. When they do
 * not, the value is the default value of the new editor.
 */
export function carriedValue(
  prev: FilterEditor,
  next: FilterEditor,
  value: unknown,
): unknown {
  const fallback = defaultValueOf(next);

  if (prev.type === 'group' || next.type === 'group') {
    if (prev.type !== 'group' || next.type !== 'group') return fallback;
    if (!sameArguments(prev, next)) return fallback;

    const source =
      typeof value === 'object' && value !== null
        ? (value as Record<string, unknown>)
        : {};

    return Object.fromEntries(
      next.arguments.map((argument) => {
        const prevArgument = prev.arguments.find(
          (other) => other.id === argument.id,
        );

        return [
          argument.id,
          prevArgument
            ? carriedValue(
                prevArgument.editor,
                argument.editor,
                source[argument.id],
              )
            : defaultValueOf(argument.editor),
        ];
      }),
    );
  }

  if (prev.type === 'select' && next.type === 'select') {
    return changeArity(
      value,
      Boolean(prev.multiple),
      Boolean(next.multiple),
      offeredBy(next),
      fallback,
    );
  }

  if (prev.type === 'custom' && next.type === 'custom') {
    if (prev.kind !== next.kind) return fallback;

    return changeArity(
      value,
      Boolean(prev.multiple),
      Boolean(next.multiple),
      anyValue,
      fallback,
    );
  }

  const textTypes = ['text', 'list'];

  if (textTypes.includes(prev.type) && textTypes.includes(next.type)) {
    return changeArity(
      value,
      prev.type === 'list',
      next.type === 'list',
      (candidate) => typeof candidate === 'string',
      fallback,
    );
  }

  if (prev.type === 'number' && next.type === 'number') {
    return typeof value === 'number' ? value : fallback;
  }

  return fallback;
}

/** The rule that makes two conditions the same */
export type Uniqueness = 'operator' | 'field';

function conflicts(
  condition: FilterCondition,
  field: string,
  operator: string,
  uniqueness: Uniqueness,
) {
  return (
    condition.field === field &&
    (uniqueness === 'field' || condition.operator === operator)
  );
}

/**
 * The operators of a field that a new condition can take: not deprecated,
 * and not used by one of the `others` conditions.
 */
export function freeOperators(
  field: FilterField,
  others: FilterCondition[],
  uniqueness: Uniqueness,
): FilterOperator[] {
  return field.operators.filter(
    (operator) =>
      !operator.deprecated &&
      !others.some((other) =>
        conflicts(other, field.id, operator.id, uniqueness),
      ),
  );
}

/** A new condition on a field, or `undefined` when the field is not free */
export function newCondition(
  field: FilterField,
  others: FilterCondition[],
  uniqueness: Uniqueness,
): FilterCondition | undefined {
  const [operator] = freeOperators(field, others, uniqueness);

  if (!operator) return undefined;

  return {
    field: field.id,
    operator: operator.id,
    value: defaultValueOf(operator.editor),
  };
}
