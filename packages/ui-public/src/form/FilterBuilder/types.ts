import { type ReactNode } from 'react';
import { type Message, type TextMessage } from '../../Message';

/** One condition of the filter: a tile with a field, an operator and a value */
export type FilterCondition = {
  /** The `id` of the field of the condition */
  field: string;
  /** The `id` of the operator of the condition, in the `operators` of the field */
  operator: string;
  /**
   * The value of the condition. Its shape comes from the editor of the
   * operator (see `FilterEditor`).
   */
  value: unknown;
};

/** A thing that the user can filter by, for example a field of a model */
export type FilterField = {
  /** The key of the field. It goes in the `field` of a condition. */
  id: string;
  /** The name of the field, in the select of a tile and in the "+" menu */
  label: TextMessage;
  /**
   * A code of the field, for example its API key or its path in your data.
   * The menus show it after the label, in a monospaced font. The tile shows
   * only the label.
   * @example "author.name"
   */
  code?: TextMessage;
  /**
   * The ways to compare the field, in the order of the select of a tile. A
   * new condition takes the first operator that is free and not deprecated.
   */
  operators: FilterOperator[];
};

/** One way to compare a field, for example "is", "contains" or "is after" */
export type FilterOperator = {
  /** The key of the operator. It goes in the `operator` of a condition. */
  id: string;
  /** The text of the operator, in the select of a tile */
  label: TextMessage;
  /** The input of the value of the condition */
  editor: FilterEditor;
  /**
   * An operator that you keep for the filters that use it. A condition that
   * has it still shows it, but the user cannot pick it.
   */
  deprecated?: boolean;
};

/** One option of a select editor */
export type FilterSelectOption = {
  /** The value that goes in the condition */
  value: string;
  /** The text of the option */
  label: TextMessage;
};

/** The operator has no value, for example "is empty". The value is `null`. */
export type FilterNoneEditor = { type: 'none' };

/**
 * A text input. "text" gives a string, "number" gives a number or `null`,
 * and "list" gives a list of strings: the user separates them with commas.
 */
export type FilterTextEditor = {
  type: 'text' | 'number' | 'list';
  /** The text of the input when it is empty */
  placeholder?: TextMessage;
};

/**
 * A select. The value is a string or `null`, or a list of strings with
 * `multiple`.
 */
export type FilterSelectEditor = {
  type: 'select';
  /** The options of the select */
  options: FilterSelectOption[];
  /** The user can pick more than one option */
  multiple?: boolean;
  /**
   * The value of a new condition, and the value after a change of operator
   * that cannot keep the old value. Give a list with `multiple`. Use it when
   * a condition with no value means nothing, for example "Featured is" with
   * the options "Yes" and "No".
   * @default null, or an empty list with `multiple`
   */
  defaultValue?: string | string[] | null;
};

/** One input of a group editor */
export type FilterArgument = {
  /** The key of the value of the argument, in the value of the group */
  id: string;
  /** The text before the input, in the tile */
  label: TextMessage;
  /** The input of the argument. A group cannot contain a group. */
  editor: Exclude<FilterEditor, FilterGroupEditor>;
};

/**
 * More than one input, each with a label, for example a distance and a
 * point. The value is an object with one key for each argument.
 */
export type FilterGroupEditor = {
  type: 'group';
  /** The inputs of the group, in the order of the tile */
  arguments: FilterArgument[];
};

/** What the `render` function of a custom editor gets */
export type FilterEditorRenderProps = {
  /** The value of the condition */
  value: unknown;
  /** Call it with the new value when the user changes it */
  onChange: (value: unknown) => void;
  /** The user cannot change the value. The input has the disabled look. */
  disabled: boolean;
  /**
   * The user can read and copy the value, but cannot change it. Give it to
   * the `readOnly` of your input. It is `false` when `disabled` is `true`.
   */
  readOnly: boolean;
  /**
   * The name of the input for a screen reader, for example "Value of
   * Author". Give it to your input as its `aria-label`.
   */
  ariaLabel: string;
};

/**
 * An input of your own, for example a date picker or a record picker. Draw
 * a bare input, with no border: the tile draws the border.
 */
export type FilterCustomEditor = {
  type: 'custom';
  /**
   * The kind of the value. When the user changes the operator, the value
   * stays only when the two custom editors have the same kind.
   * @example "date"
   */
  kind: string;
  /**
   * The value is a list of values of the kind. When the user changes between
   * a single and a multiple editor of the same kind, the value becomes a list
   * of one value, or the first value of the list.
   */
  multiple?: boolean;
  /**
   * The value of a new condition, and the value after a change of operator
   * that cannot keep the old value
   */
  defaultValue: unknown;
  /** Draws the input */
  render: (props: FilterEditorRenderProps) => ReactNode;
};

/** The input of the value of a condition, for one operator */
export type FilterEditor =
  /** No value */
  | FilterNoneEditor
  /** A text, a number or a list of texts */
  | FilterTextEditor
  /** One or more options */
  | FilterSelectEditor
  /** More than one input */
  | FilterGroupEditor
  /** An input of your own */
  | FilterCustomEditor;

/** The props of `FilterBuilder` */
export type FilterBuilderProps = {
  /** The things that the user can filter by */
  fields: FilterField[];
  /** The conditions, in the order of the tiles */
  value: FilterCondition[];
  /** Runs with all the conditions when the user changes one of them */
  onChange: (value: FilterCondition[]) => void;
  /** The user cannot change the conditions. The tiles have the disabled look. */
  disabled?: boolean;
  /**
   * The user can read and copy the conditions, but cannot change them. The
   * tiles show with no "+" button, no remove button and no clear button.
   */
  readOnly?: boolean;
  /**
   * The text when there are no conditions
   * @default "No filters set"
   */
  emptyLabel?: Message;
  /**
   * A field can have only one condition. Without it, a field can have one
   * condition for each operator.
   * @default false
   */
  oneConditionPerField?: boolean;
};
