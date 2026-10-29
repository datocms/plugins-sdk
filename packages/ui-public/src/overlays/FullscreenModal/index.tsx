import React, { useState } from 'react';
import { ActionLayer } from '../../actions/Actions/registry';
import { useTranslation } from '../../i18n';
import type { Message, TextMessage } from '../../Message';
import ModalLayer from '../Modal/Layer';
import NewZIndex from '../NewZIndex';
import Portal from '../Portal';
import {
  closeAction,
  ModalCloseContext,
  useDialogLayer,
  useModalClose,
} from '../useModalClose';
import FullscreenModalPanel from './Panel';
import {
  FullscreenModalTitleContext,
  useFullscreenModalTitle,
} from './TitleContext';

export { useFullscreenModalTitle };

// React 17 has no `useId`, thus we make the ids of the titles with a counter.
let nextTitleId = 0;

/**
 * The name of the dialog for a screen reader: its title, or an `ariaLabel`
 * when the content shows its own title.
 */
export type FullscreenModalName =
  | {
      /**
       * The title of the dialog. The dialog has no header: the toolbars of
       * the content read the title with `useFullscreenModalTitle`. The
       * title is also the name of the dialog.
       */
      title: Message;
      ariaLabel?: never;
    }
  | {
      /** The name of the dialog, for a screen reader */
      ariaLabel: TextMessage;
      title?: never;
    };

export type FullscreenModalProps = FullscreenModalName & {
  /**
   * Closes the dialog. It runs when the user clicks the close button or
   * presses Escape. A dialog with no `onClose` has no close button.
   */
  onClose?: (() => void) | null;
  /** The content of the dialog. It has its own toolbar. */
  children: React.ReactNode;
};

/**
 * A dialog that fills almost all the screen. The content brings its own
 * toolbar. For a short form, use Modal.
 */
const FullscreenModal = React.memo(function FullscreenModal({
  title,
  ariaLabel,
  onClose,
  children,
}: FullscreenModalProps) {
  const { tc, tm } = useTranslation();
  const [titleId] = useState(() => `FullscreenModal__title-${++nextTitleId}`);
  const layer = useDialogLayer();
  const { didMount, dialogRef, locale, handleClose, contextValue } =
    useModalClose({
      onClose,
    });

  return (
    <ActionLayer
      kind="dialog"
      actions={onClose ? [closeAction(handleClose)] : undefined}
    >
      <Portal>
        <FullscreenModalTitleContext.Provider value={title ?? null}>
          <ModalCloseContext.Provider value={contextValue}>
            <NewZIndex forcedValue={layer.zIndex}>
              {(zIndex) => (
                <ModalLayer kind="fullscreen" style={{ zIndex }}>
                  <FullscreenModalPanel
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    lang={locale}
                    aria-labelledby={title ? titleId : undefined}
                    aria-label={ariaLabel ? tm(ariaLabel) : undefined}
                    // The name of the dialog: the content shows the title
                    name={
                      title && (
                        <span id={titleId} hidden>
                          {tc(title)}
                        </span>
                      )
                    }
                    closeButton={onClose ? { onClick: handleClose } : undefined}
                  >
                    {didMount && children}
                  </FullscreenModalPanel>
                </ModalLayer>
              )}
            </NewZIndex>
          </ModalCloseContext.Provider>
        </FullscreenModalTitleContext.Provider>
      </Portal>
    </ActionLayer>
  );
});

export default FullscreenModal;
