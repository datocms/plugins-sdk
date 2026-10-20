import React, { useContext, useState } from 'react';
import { Generic } from '../../icons/index';
import Button from '../actions/Button';
import { HotKeyListener, HotKeyStack } from '../actions/HotKey';
import { useTranslation } from '../i18n';
import type { Message, TextMessage } from '../Message';
import NewZIndex from './NewZIndex';
import Portal from './Portal';
import {
  ModalCloseContext,
  useDialogLayer,
  useModalClose,
} from './useModalClose';

const FullscreenModalTitleContext = React.createContext<Message | null>(null);

/**
 * Gives the title of the FullscreenModal around the component, already
 * rendered, or null out of a FullscreenModal. A content that is also a page
 * (a record form, a list) shows it in its toolbar in place of the title of
 * the page.
 */
export function useFullscreenModalTitle(): React.ReactElement | null {
  const { tc } = useTranslation();
  const title = useContext(FullscreenModalTitleContext);

  // biome-ignore lint/complexity/noUselessFragments: the fragment makes a React element, thus a Message for Pane.Header.Title
  return title ? <>{tc(title)}</> : null;
}

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
    <HotKeyStack forceStackPriority={layer.hotKeyPriority}>
      <HotKeyListener
        hotKey="escape"
        description={{ id: 'hotkeys.closeModal' }}
        trigger={handleClose}
        enabled={!!onClose}
      >
        <Portal>
          <FullscreenModalTitleContext.Provider value={title ?? null}>
            <ModalCloseContext.Provider value={contextValue}>
              <NewZIndex forcedValue={layer.zIndex}>
                {(zIndex) => (
                  <div className="Modal Modal--fullscreen" style={{ zIndex }}>
                    <div className="Modal__backdrop" />
                    <div
                      ref={dialogRef}
                      role="dialog"
                      aria-modal="true"
                      lang={locale}
                      className="Modal__content"
                      aria-labelledby={title ? titleId : undefined}
                      aria-label={ariaLabel ? tm(ariaLabel) : undefined}
                    >
                      {/* The name of the dialog: the content shows the title */}
                      {title && (
                        <span id={titleId} hidden>
                          {tc(title)}
                        </span>
                      )}
                      {onClose && (
                        <Button
                          tone="ghost"
                          size="large"
                          iconOnly
                          icon={Generic.CloseIcon}
                          label={{ id: 'modal.close' }}
                          className="Modal__close"
                          onClick={handleClose}
                        />
                      )}
                      <div className="Modal__content__inner">
                        {didMount && children}
                      </div>
                    </div>
                  </div>
                )}
              </NewZIndex>
            </ModalCloseContext.Provider>
          </FullscreenModalTitleContext.Provider>
        </Portal>
      </HotKeyListener>
    </HotKeyStack>
  );
});

export default FullscreenModal;
