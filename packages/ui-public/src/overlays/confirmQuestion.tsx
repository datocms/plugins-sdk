import React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from '../i18n';
import { type Message } from '../Message';

/**
 * The tone of a button of the dialog: "negative" is red, for a destructive
 * action. "positive" is the primary tone, for the main action. "neutral" is
 * soft, for an action with a cost that the user must read (a plan change,
 * minutes of video encoding).
 */
export type Intent = 'positive' | 'negative' | 'neutral';

/** One button of the confirm dialog. */
export type Choice<ResponseType = unknown> = {
  /** The text of the button. */
  label: Message;
  /** The value that the promise gives when the user clicks the button. */
  value: ResponseType;
  /**
   * The tone of the button: see `Intent`.
   * @default "neutral"
   */
  intent?: Intent;
};

/** The options of `showCustomConfirm`. */
export type QuestionPayload<ResponseType = unknown> = {
  /** The title of the dialog, for example "Delete this record?". */
  title: Message;
  /** The text that tells what the choice does. */
  content: Message;
  /** The buttons that do the action. Each one has its own value. */
  choices: Choice<ResponseType>[];
  /**
   * The cancel button. The user also gets this choice when they press
   * Escape.
   */
  cancel: Choice<ResponseType>;
  /**
   * Asks the user to type a word before the choices turn on. Use it for an
   * action that the user cannot undo.
   */
  explicitConfirmation?: {
    /** The label above the input. */
    label: Message;
    /** The text that the user must type, for example the name of a project. */
    confirmString: string;
  };
  /**
   * The label of a switch that is off at first. The user must turn it on
   * before the choices turn on.
   */
  acknowledgement?: Message;
};

/** The texts of a confirm dialog with one choice. */
export type ConfirmTexts = {
  /** The title of the dialog, for example "Delete this record?". */
  title: Message;
  /** The text that tells what the action does. */
  question: Message;
  /** The label of the button that confirms, for example "Delete". */
  ok: Message;
  /**
   * The label of the cancel button.
   * @default "Cancel"
   */
  cancel?: Message;
};

/** The texts of a locale key family: see `confirmTexts`. */
export type ConfirmKeyTexts = Required<ConfirmTexts> & {
  /** The text when the action changes nothing (`<key>.notDestructive`). */
  notDestructive: Message;
};

/** The options of `showConfirm`. */
export type ConfirmOptions = ConfirmTexts & {
  /**
   * The tone of the button that confirms: "negative" (red), "positive"
   * (primary) or "neutral" (soft). See `Intent`.
   * @default "negative"
   */
  intent?: Intent;
};

export const defaultCancel = { id: 'messages.confirm.defaultCancel' };

/**
 * Makes the texts of a confirm dialog from a family of locale keys:
 * `<key>.title`, `<key>.question` (HTML), `<key>.ok`, `<key>.cancel` (or
 * "Cancel" when the key does not exist) and `<key>.notDestructive` (HTML,
 * for `showConfirmForDestructiveActions`). A dialog reads only the texts
 * that it shows.
 */
export function confirmTexts(
  key: string,
  values?: Record<string, unknown>,
): ConfirmKeyTexts {
  return {
    title: <FormattedMessage id={`${key}.title`} values={values} />,
    question: <FormattedHTMLMessage id={`${key}.question`} values={values} />,
    ok: <FormattedMessage id={`${key}.ok`} values={values} />,
    cancel: (
      <FormattedMessage id={defaultCancel.id}>
        {(value) => (
          <FormattedMessage
            id={`${key}.cancel`}
            values={values}
            defaultValue={value}
          />
        )}
      </FormattedMessage>
    ),
    notDestructive: (
      <FormattedHTMLMessage id={`${key}.notDestructive`} values={values} />
    ),
  };
}

/**
 * Makes the question of a confirm dialog with one choice. The answer is
 * "ok" when the user confirms, and false when the user cancels.
 */
export function confirmQuestion({
  title,
  question,
  ok,
  cancel = defaultCancel,
  intent = 'negative',
}: ConfirmOptions): QuestionPayload<'ok' | false> {
  return {
    title,
    content: question,
    choices: [{ label: ok, value: 'ok', intent }],
    cancel: { label: cancel, value: false },
  };
}
