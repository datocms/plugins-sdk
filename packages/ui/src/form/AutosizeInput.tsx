import classNames from 'classnames';
import React, { ReactNode } from 'react';

export type AutosizeInputProps = {
  /** The text that sets the width, usually the value of the input. */
  text: string;
  /**
   * The text that sets the width when `text` is empty. Give the placeholder
   * of the input.
   */
  placeholder?: string | null;
  /**
   * A class for the wrapper. Set the `font-size`, the
   * `--autosize-input-padding-inline` and the `--autosize-input-border-inline`
   * of the input with it. The default values are the padding and the border
   * of a standard input.
   */
  className?: string;
  /** The `input` element. */
  children: ReactNode;
};

// A hidden copy of the text is in the same grid cell as the input. Thus the
// browser calculates the width from the real text in the real font.
//
// The hidden copy uses the font of the wrapper. Set the font size, the
// horizontal padding and the side border width of the input on the wrapper
// (`font-size`, `--autosize-input-padding-inline` and
// `--autosize-input-border-inline`), not on the input. Thus the copy gets the
// same width as the input.
function AutosizeInput({
  text,
  placeholder,
  className,
  children,
}: AutosizeInputProps) {
  return (
    <span
      className={classNames('AutosizeInput', className)}
      data-value={text || placeholder || ''}
    >
      {children}
    </span>
  );
}

export default React.memo(AutosizeInput);
