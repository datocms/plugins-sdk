import React, { useCallback, useRef } from 'react';

type TextElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Gives the handlers of a text input of a form (`StringInput`,
 * `TextareaInput`). The input shows `null` and `''` as the same empty text.
 * Thus the blur compares the text of the element at focus and at blur. When
 * the text did not change, `onBlur` gets the `value` of the form as it is: the
 * form marks the field as touched, but does not become dirty. A text that the
 * user clears gives `null`. The `onFocus` of the caller runs too.
 */
export function useTextInputHandlers<E extends TextElement>({
  value,
  onChange,
  onBlur,
  onFocus,
}: {
  value: string | null | undefined;
  onChange?: (newValue: string) => void;
  onBlur?: (newValue: string | null) => void;
  onFocus?: React.FocusEventHandler<E>;
}) {
  const valueRef = useRef(value);
  valueRef.current = value;

  const ref = useRef<E>(null);
  const textAtFocusRef = useRef('');

  const handleFocus = useCallback(
    (event: React.FocusEvent<E>) => {
      textAtFocusRef.current = event.target.value;
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<E>) => {
      onChange?.(event.target.value);
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const text = ref.current.value;

    if (text === textAtFocusRef.current) {
      // An `undefined` value can change the shape of the form values
      if (valueRef.current !== undefined) {
        onBlur?.(valueRef.current);
      }
      return;
    }

    onBlur?.(text === '' ? null : text);
  }, [onBlur]);

  return {
    ref,
    onFocus: handleFocus,
    onChange: handleChange,
    onBlur: handleBlur,
  };
}
