import classNames from 'classnames';
import React, { CSSProperties, ReactNode, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import CopyButton from './CopyButton';

export type CodeSnippetProps = {
  /** The text of the box. The copy button copies it. */
  code: string;
  /**
   * The name of the box for screen readers, for example "Request body". The
   * box is a region that the keyboard can focus, thus the arrow keys
   * scroll it.
   */
  ariaLabel: TextMessage;
  /**
   * The box scrolls when the text is higher than this, in CSS pixels.
   * Without it, the box is as high as the text.
   * @example 400
   */
  maxHeight?: number;
  /**
   * A different view of the text, for example a JSON tree. When it is not
   * set, the box shows the text.
   */
  children?: ReactNode;
};

function CodeSnippet({
  code,
  ariaLabel,
  maxHeight,
  children,
}: CodeSnippetProps) {
  const { tm } = useTranslation();
  const style = useMemo<CSSProperties | undefined>(
    () =>
      maxHeight
        ? ({ '--CodeSnippet-max-height': `${maxHeight}px` } as CSSProperties)
        : undefined,
    [maxHeight],
  );

  return (
    <div className="CodeSnippet">
      <div
        className={classNames('CodeSnippet__body', {
          'CodeSnippet__body--custom': children,
        })}
        style={style}
        role="region"
        aria-label={tm(ariaLabel)}
        // The keyboard must reach the box to scroll it
        tabIndex={0}
      >
        {children ?? code}
      </div>
      <span className="CodeSnippet__copy">
        <CopyButton value={code} />
      </span>
    </div>
  );
}

export default React.memo(CodeSnippet);
