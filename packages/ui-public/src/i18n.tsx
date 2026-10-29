import React, {
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import filterXSS from 'xss';
import {
  isHtmlMessage,
  isIntlMessage,
  type Message,
  type TextMessage,
} from './Message';
import { type TextsAdapter, useTexts } from './TextsProvider';
import { escapeHtml } from './utils/escapeHtml';

export type UseTranslationResult = {
  /** A key of yours, with its values, gives the text (see `TextsAdapter`) */
  t: TextsAdapter['t'];
  /**
   * Turns a `TextMessage` prop into a string, for an attribute or a tooltip:
   * a plain string as it is (it is never a key), `{ id, values }` with `t`
   */
  tm: (message: TextMessage) => string;
  /**
   * Turns a `Message` prop into content: a translation keeps its markup,
   * `{ html }` is sanitized, a string or an element is given as it is
   */
  tc: (message: Message) => ReactNode;
};

/**
 * The texts of the nearest `TextsProvider`, with `tm` and `tc` for a
 * component that gets a `TextMessage` or a `Message` prop. The apps and the
 * package import this one, never the one of react-i18next.
 */
export function useTranslation(): UseTranslationResult {
  const { t } = useTexts();

  const tm = useCallback(
    (message: TextMessage) =>
      typeof message === 'string' ? message : t(message.id, message.values),
    [t],
  );

  return useMemo(() => ({ t, tm, tc }), [t, tm]);
}

function tc(message: Message): ReactNode {
  if (isIntlMessage(message)) {
    return <FormattedHTMLMessage id={message.id} values={message.values} />;
  }

  if (isHtmlMessage(message)) {
    return (
      <span
        // biome-ignore lint/security: filterXSS removes the unsafe parts
        dangerouslySetInnerHTML={{ __html: filterXSS(message.html) }}
      />
    );
  }

  return message;
}

type FormattedMessageProps = {
  id: string;
  values?: Record<string, unknown>;
  children?: (message: string) => ReactElement;
  defaultValue?: React.ReactNode;
};

const PLACEHOLDER_PREFIX = '\x00__REACT_';
const PLACEHOLDER_SUFFIX = '__\x00';
const PLACEHOLDER_REGEX = new RegExp(
  `${PLACEHOLDER_PREFIX}(\\w+)${PLACEHOLDER_SUFFIX}`,
  'g',
);

const textOptions: InterpolateOptions = {
  processValue: (value) => value,
  processResult: (result) => result,
  renderStringPart: (part) => part,
};

export function FormattedMessage({
  id,
  values,
  children,
  defaultValue,
}: FormattedMessageProps) {
  const { t } = useTranslation();

  if (children) {
    return <>{children(t(id, { ...values, defaultValue }))}</>;
  }

  return (
    <span>
      {interpolateReactElements(
        values,
        (processedValues) => t(id, { ...processedValues, defaultValue }),
        textOptions,
      )}
    </span>
  );
}

const htmlOptions: InterpolateOptions = {
  processValue: (value) => escapeHtml(String(value)),
  // For some reason, when the localizations use single quote in `target='_blank'` attribute,
  // React omits the whole `a` tag. Replacing single quotes with double fixes the problem.
  processResult: (result) =>
    result.replace("target='_blank'", 'target="_blank"'),
  renderStringPart: (part, index) => (
    // biome-ignore lint/security: safe
    <span key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />
  ),
};

export function FormattedHTMLMessage({
  id,
  values,
  children,
}: FormattedMessageProps) {
  const { t } = useTranslation();

  if (children) {
    const result = values
      ? t(
          id,
          Object.fromEntries(
            Object.entries(values).map(([key, value]) => [
              key,
              escapeHtml(String(value)),
            ]),
          ),
        )
      : t(id);
    return <>{children(result)}</>;
  }

  return (
    <>
      {interpolateReactElements(
        values,
        (processedValues) => t(id, processedValues),
        htmlOptions,
      )}
    </>
  );
}

type InterpolateOptions = {
  processValue: (value: unknown) => unknown;
  processResult: (result: string) => string;
  renderStringPart: (part: string, index: number) => ReactNode;
};

function interpolateReactElements(
  values: Record<string, unknown> | undefined,
  translate: (processedValues: Record<string, unknown> | undefined) => string,
  options: InterpolateOptions,
): ReactNode {
  const reactElements: Record<string, React.ReactElement> = {};
  const processedValues: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(values ?? {})) {
    if (isValidElement(value)) {
      reactElements[key] = value;
      processedValues[key] = `${PLACEHOLDER_PREFIX}${key}${PLACEHOLDER_SUFFIX}`;
    } else {
      processedValues[key] = options.processValue(value);
    }
  }

  const result = options.processResult(
    translate(values ? processedValues : undefined),
  );

  if (Object.keys(reactElements).length === 0) {
    return options.renderStringPart(result, 0);
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let partIndex = 0;

  for (const match of result.matchAll(PLACEHOLDER_REGEX)) {
    if (match.index > lastIndex) {
      parts.push(
        options.renderStringPart(
          result.slice(lastIndex, match.index),
          partIndex++,
        ),
      );
    }

    const key = match[1];
    if (reactElements[key]) {
      parts.push(
        <React.Fragment key={key}>{reactElements[key]}</React.Fragment>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < result.length) {
    parts.push(options.renderStringPart(result.slice(lastIndex), partIndex));
  }

  return <>{parts}</>;
}
