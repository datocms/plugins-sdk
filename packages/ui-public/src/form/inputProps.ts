// The props contract of the inputs that `Field` renders. This file is not
// part of `RawField`, because `RawField` imports formik. The inputs that ship
// in react-ui import these types, and a plugin has no formik.

/** The props of an input that is disabled: it needs no name and no handlers. */
export type BaseInputComponentPropsFieldDisabled<Value = unknown> = {
  /** The `id` that `Field` gives, for the `label` to point to. */
  id?: string;
  /** The value of the field in the form. */
  value: Value;
  /** Tells that the user cannot change the value. */
  disabled: true;
  /** The name of the field in the form. */
  name?: string;
  /** Call it with the new value (not with an event) when the user changes it. */
  onChange?: (newValue: Value) => void;
  /** Call it with the value when the user leaves the input. */
  onBlur?: (newValue: Value) => void;
};

/** The props of an input that the user can change. */
export type BaseInputComponentPropsFieldEnabled<Value = unknown> = {
  /** The `id` that `Field` gives, for the `label` to point to. */
  id?: string;
  /** The value of the field in the form. */
  value: Value;
  /** Tells that the user cannot change the value. */
  disabled?: boolean;
  /**
   * The name of the field in the form. The input puts it on its element. A
   * controlled input out of a form needs no name.
   */
  name?: string;
  /** Call it with the new value (not with an event) when the user changes it. */
  onChange: (newValue: Value) => void;
  /**
   * Call it with the value when the user leaves the input. The form marks
   * the field as touched and checks the value. It is optional, because a
   * controlled input out of a form needs no blur. The `onBlur` of a
   * react-final-form `input` takes no value: give `() => input.onBlur()`.
   */
  onBlur?: (newValue: Value) => void;
};

/**
 * A static property of an input component that `Field` reads. With
 * `fieldLabel: 'inside'`, the input draws the label of the field itself (a
 * switch has its label next to it): `Field` gives its label in the `label`
 * prop and draws no label above the input.
 */
export type FieldInputStatics = {
  fieldLabel?: 'inside';
};

/**
 * The `aria-labelledby` that `Field` gives: the `id` of the text of its label.
 * A group input (a radio group) puts it on its group element, because the
 * `htmlFor` of the label cannot point to a group.
 */
export type FieldLabelledByProps = {
  /** The `id` of the text of the label of the field */
  'aria-labelledby'?: string;
};

/**
 * The contract of an input that `Field` renders: `Field` gives the value and
 * the handlers, and the input only shows the value and calls the handlers.
 * The union has the variants `BaseInputComponentPropsFieldEnabled` and
 * `BaseInputComponentPropsFieldDisabled`.
 */
export type BaseInputComponentPropsField<Value = unknown> =
  | BaseInputComponentPropsFieldEnabled<Value>
  | BaseInputComponentPropsFieldDisabled<Value>;

/**
 * The props of an input that the user cannot change, because it is disabled
 * or read-only. It needs no name and no handlers.
 */
export type BaseInputComponentPropsFieldWithReadOnlyNonEditable<
  Value = unknown,
  ChangeDetail extends unknown[] = [],
> = {
  /** The `id` that `Field` gives, for the `label` to point to. */
  id?: string;
  /** The value of the field in the form. */
  value: Value;
  /** The name of the field in the form. */
  name?: string;
  /**
   * Call it with the new value (not with an event) when the user changes it.
   * Some inputs give more arguments after the value (`ChangeDetail`).
   */
  onChange?: (newValue: Value, ...detail: ChangeDetail) => void;
  /** Call it with the value when the user leaves the input. */
  onBlur?: (newValue: Value) => void;
} & (
  | { disabled: true; readOnly?: boolean }
  | { readOnly: true; disabled?: boolean }
);

/** The props of an input with a read-only mode, when the user can change it. */
export type BaseInputComponentPropsFieldWithReadOnlyEditable<
  Value = unknown,
  ChangeDetail extends unknown[] = [],
> = {
  /** The `id` that `Field` gives, for the `label` to point to. */
  id?: string;
  /** The value of the field in the form. */
  value: Value;
  /** Tells that the user cannot change the value. */
  disabled?: boolean;
  /** Tells that the user can see and copy the value, but not change it. */
  readOnly?: boolean;
  /** The name of the field in the form. A controlled input out of a form needs no name. */
  name?: string;
  /**
   * Call it with the new value (not with an event) when the user changes
   * it. Some inputs give more arguments after the value (`ChangeDetail`).
   */
  onChange: (newValue: Value, ...detail: ChangeDetail) => void;
  /**
   * Call it with the value when the user leaves the input. It is optional,
   * as in `BaseInputComponentPropsFieldEnabled`.
   */
  onBlur?: (newValue: Value) => void;
};

/**
 * The contract of an input with a read-only mode. The union has the variants
 * `BaseInputComponentPropsFieldWithReadOnlyEditable` and
 * `BaseInputComponentPropsFieldWithReadOnlyNonEditable`. `ChangeDetail` is
 * the list of the arguments that `onChange` gets after the value. It is empty
 * by default, thus a handler with one parameter always fits.
 */
export type BaseInputComponentPropsFieldWithReadOnly<
  Value = unknown,
  ChangeDetail extends unknown[] = [],
> =
  | BaseInputComponentPropsFieldWithReadOnlyEditable<Value, ChangeDetail>
  | BaseInputComponentPropsFieldWithReadOnlyNonEditable<Value, ChangeDetail>;
