import { useMemo } from 'react';
import type { HostServices } from 'ui/HostServicesProvider';
import { type BaseCtx, useLatestCtx } from './ctx';
import { useMessageText } from './messageText';

/**
 * The options of `ctx.openConfirm` with the checks of the release of the SDK
 * that adds them. The host gives the answer only after the user does the
 * checks. A host that is older than that release ignores them.
 */
type ConfirmOptionsWithChecks = Parameters<BaseCtx['openConfirm']>[0] & {
  explicitConfirmation?: { label: string; confirmString: string };
  acknowledgement?: string;
};

/**
 * The same release of the SDK adds the checks of `ctx.openConfirm` and the
 * date settings of `ctx.ui`. Thus a host without `ctx.ui.dateFormat` is older
 * than the checks.
 */
function hostHasConfirmChecks(ctx: BaseCtx) {
  return 'dateFormat' in ctx.ui;
}

/**
 * The services of ui from the methods of `ctx`: the host draws the
 * notifications and the confirm dialog out of the frame of the plugin.
 */
export function useCtxHostServices(ctx: BaseCtx): HostServices {
  const messageText = useMessageText();

  const ctxRef = useLatestCtx(ctx);

  return useMemo<HostServices>(
    () => ({
      notice: (message) => {
        void ctxRef.current.notice(messageText(message));
      },
      warn: (message) => {
        void ctxRef.current.customToast({
          type: 'warning',
          message: messageText(message),
          dismissAfterTimeout: true,
        });
      },
      alert: (message) => {
        void ctxRef.current.alert(messageText(message));
      },
      confirm: async (question) => {
        const { explicitConfirmation, acknowledgement } = question;

        if (
          import.meta.env.DEV &&
          (explicitConfirmation || acknowledgement) &&
          !hostHasConfirmChecks(ctxRef.current)
        ) {
          console.warn(
            'The DatoCMS host of this plugin is older than the checks of ctx.openConfirm. The dialog shows without explicitConfirmation and acknowledgement.',
          );
        }

        const options: ConfirmOptionsWithChecks = {
          title: messageText(question.title),
          content: messageText(question.content),
          choices: question.choices.map((choice) => ({
            label: messageText(choice.label),
            value: choice.value,
            // The host has no "neutral" tone: its default button is the
            // nearest one.
            intent: choice.intent === 'neutral' ? undefined : choice.intent,
          })),
          cancel: {
            label: messageText(question.cancel.label),
            value: question.cancel.value,
          },
          ...(explicitConfirmation && {
            explicitConfirmation: {
              label: messageText(explicitConfirmation.label),
              confirmString: explicitConfirmation.confirmString,
            },
          }),
          ...(acknowledgement && {
            acknowledgement: messageText(acknowledgement),
          }),
        };

        const result = await ctxRef.current.openConfirm(options);

        // The host gives null when the user closes the panel with no choice.
        return (result ??
          question.cancel.value) as typeof question.cancel.value;
      },
    }),
    [messageText],
  );
}
