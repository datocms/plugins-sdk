type EditStateProps = {
  disabled?: boolean;
  readOnly?: boolean;
};

export type EditState = {
  // The user cannot change the value (disabled or read-only)
  locked: boolean;
  // The faded look of a disabled input
  disabled: boolean;
  // The input shows the read-only look: the regular look, without hover and
  // edit actions. It is true only when the input is read-only and not
  // disabled, because the disabled look wins.
  showsReadOnly: boolean;
  // The state class for the root element of the input
  stateClass: 'is-disabled' | 'is-read-only' | undefined;
};

// Every input that accepts readOnly reads its state with this function, thus
// all the inputs apply the same rule.
export function getEditState({
  disabled = false,
  readOnly = false,
}: EditStateProps): EditState {
  const showsReadOnly = readOnly && !disabled;

  return {
    locked: disabled || readOnly,
    disabled,
    showsReadOnly,
    stateClass: disabled
      ? 'is-disabled'
      : showsReadOnly
        ? 'is-read-only'
        : undefined,
  };
}
