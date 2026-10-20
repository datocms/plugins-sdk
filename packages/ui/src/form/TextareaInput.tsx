import classNames from 'classnames';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { useFieldInput } from './FieldWrapper';
import { BaseInputComponentPropsFieldWithReadOnly } from './inputProps';
import { useTextInputHandlers } from './useTextInputHandlers';

/**
 * The props of `TextareaInput`: the contract of an input with a read-only
 * mode, and the attributes of a `textarea` element (`maxLength`,
 * `spellCheck`, `dir`, ...).
 */
export type TextareaInputProps = BaseInputComponentPropsFieldWithReadOnly<
  string | null
> &
  Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'value'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'disabled'
    | 'readOnly'
    | 'placeholder'
    | 'rows'
  > & {
    /**
     * The text that shows when the input is empty (a plain string or
     * `{ id }`). `null` is the same as no text.
     * @example "A short summary for the search engines"
     */
    placeholder?: TextMessage | null;
    /**
     * Shows the value in the monospaced font, for a value that is code: a
     * JSON payload, a certificate, an XML document.
     * @default false
     */
    code?: boolean;
    /**
     * The smallest height of the input, in lines. The input grows with its
     * text.
     * @default 2
     */
    rows?: number;
    /**
     * The largest height of the input, in lines. A longer text scrolls in
     * the input. Without it, the input grows with all its text.
     */
    maxRows?: number;
  };

/**
 * Sets the height of the textarea from its text. The height goes to `auto`
 * first: thus `scrollHeight` gives the height of the text, also when the
 * text becomes shorter. The `rows` of the element keep the smallest height.
 */
function useAutosize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  text: string,
  maxRows: number | undefined,
) {
  const resize = useCallback(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.style.height = 'auto';

    const style = window.getComputedStyle(element);
    const borders =
      Number.parseFloat(style.borderTopWidth) +
      Number.parseFloat(style.borderBottomWidth);
    const contentHeight = element.scrollHeight + borders;

    if (maxRows === undefined) {
      element.style.height = `${contentHeight}px`;
      return;
    }

    const paddings =
      Number.parseFloat(style.paddingTop) +
      Number.parseFloat(style.paddingBottom);
    const maxHeight =
      Number.parseFloat(style.lineHeight) * maxRows + paddings + borders;

    element.style.height = `${Math.min(contentHeight, maxHeight)}px`;
    element.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
  }, [ref, maxRows]);

  useLayoutEffect(resize, [resize, text]);

  // A new width wraps the text again: the height changes too. The height
  // that `resize` sets does not start a new measure, because the observer
  // compares only the width. The first notice of the observer always
  // measures: the styles can change between the first measure and this
  // effect.
  useEffect(() => {
    const element = ref.current;

    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    let width: number | undefined;

    let frame = 0;

    // The width of the content box also changes with the border and the
    // padding. The measure waits for the next frame: a new height in the
    // callback of the observer makes the browser report a loop.
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width !== width) {
        width = entry.contentRect.width;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(resize);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref, resize]);
}

const TextareaInput = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  code,
  rows = 2,
  maxRows,
  className,
  ...other
}: TextareaInputProps) => {
  const { tm } = useTranslation();
  const handlers = useTextInputHandlers<HTMLTextAreaElement>({
    value,
    onChange,
    onBlur,
    onFocus,
  });
  const fieldProps = useFieldInput(other);
  const text = value || '';

  useAutosize(handlers.ref, text, maxRows);

  return (
    <textarea
      {...other}
      {...fieldProps}
      {...handlers}
      className={
        classNames(className, code && 'form__input--code') || undefined
      }
      rows={rows}
      value={text}
      placeholder={placeholder ? tm(placeholder) : undefined}
    />
  );
};

export default React.memo(TextareaInput);
