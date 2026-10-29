import React, { useContext, useState } from 'react';
import { ActionLayer } from '../../actions/Actions/registry';
import Button from '../../actions/Button';
import { useTranslation } from '../../i18n';
import { type Message, type TextMessage } from '../../Message';
import NewZIndex from '../NewZIndex';
import Portal from '../Portal';
import {
  closeAction,
  ModalCloseContext,
  useDialogLayer,
  useModalClose,
} from '../useModalClose';
import ModalLayer from './Layer';
import ModalPanel, { type ModalWidth } from './Panel';

export type { ModalWidth };

// React 17 has no `useId`, thus we make the ids of the titles with a counter.
let nextTitleId = 0;

/**
 * The name of the dialog for a screen reader: the title of its header, or an
 * `ariaLabel` when the dialog has no header.
 */
export type ModalName =
  | {
      /** The title in the header, for example `{ id: 'fieldset.edit' }` */
      title: Message;
      ariaLabel?: never;
    }
  | {
      /** The name of a dialog with no header, for a screen reader */
      ariaLabel: TextMessage;
      title?: never;
    };

export type ModalProps = ModalName & {
  /**
   * Closes the dialog. It runs when the user clicks the close button, clicks
   * the cancel button of the footer, or presses Escape. A dialog with no
   * `onClose` has no close button and does not close.
   */
  onClose?: (() => void) | null;
  /** The content of the dialog. */
  children?: React.ReactNode;
  /**
   * Gives the content of the dialog no wrapper. Use it with `Modal.Body` and
   * `Modal.Footer`: they are the children, for example in a form.
   * @default false
   */
  freeContent?: boolean;
  /**
   * `false`: the dialog has no cross. Escape and a click out of the panel
   * close it. For a dialog whose field keeps the focus, for example the
   * command palette.
   * @default true
   */
  closeButton?: boolean;
  /**
   * The maximum width: "s" (600px), "m" (700px), "l" (900px) or "xl"
   * (1010px). A number of pixels is only for a plugin that gives the width of
   * its dialog.
   * @default "s"
   */
  width?: ModalWidth | number;
};

/**
 * A dialog over the page, with a header, a body and a footer. For a task
 * that needs all the screen, use FullscreenModal.
 */
const Modal = React.memo(function Modal({
  onClose,
  children,
  title,
  ariaLabel,
  freeContent = false,
  closeButton: showCloseButton = true,
  width,
}: ModalProps) {
  const { tm } = useTranslation();
  const [titleId] = useState(() => `Modal__header-${++nextTitleId}`);

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
        <NewZIndex forcedValue={layer.zIndex}>
          {(zIndex) => (
            <ModalCloseContext.Provider value={contextValue}>
              <ModalLayer
                kind="dialog"
                style={{ zIndex }}
                // Without a cross, a click out of the panel closes the dialog.
                // The panel stops the event: a click in it does not close.
                onClick={
                  onClose && !showCloseButton
                    ? (event) => {
                        if (event.target === event.currentTarget) {
                          handleClose(event);
                        }
                      }
                    : undefined
                }
              >
                <ModalPanel
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  lang={locale}
                  aria-labelledby={title ? titleId : undefined}
                  aria-label={ariaLabel ? tm(ariaLabel) : undefined}
                  width={width}
                  title={title}
                  titleId={titleId}
                  closeButton={
                    onClose && showCloseButton
                      ? { onClick: handleClose }
                      : undefined
                  }
                  freeContent={freeContent}
                  showContent={didMount}
                >
                  {children}
                </ModalPanel>
              </ModalLayer>
            </ModalCloseContext.Provider>
          )}
        </NewZIndex>
      </Portal>
    </ActionLayer>
  );
});

export type ModalPartProps = {
  /** The content of the part. */
  children: React.ReactNode;
};

/**
 * For a dialog with `freeContent`. Use it with Modal.Footer:
 *
 *   <Modal title="…" freeContent onClose={onClose}>
 *     <form …>
 *       <Modal.Body>…fields…</Modal.Body>
 *       <Modal.Footer><Button tone="primary" submit … /></Modal.Footer>
 *     </form>
 *   </Modal>
 */
const Body = React.memo(function ModalBody({ children }: ModalPartProps) {
  return <div className="Modal__body">{children}</div>;
});

/**
 * The footer must be the last element of the dialog. When a dialog has a
 * footer, the close button at the top does not show: "Cancel" in the footer
 * closes the dialog. A dialog with no action has no footer.
 */
const Footer = React.memo(function ModalFooter({ children }: ModalPartProps) {
  const { closeModal } = useContext(ModalCloseContext);

  return (
    <div className="Modal__footer">
      {closeModal && (
        <Button
          tone="ghost"
          size="small"
          label={{ id: 'messages.confirm.defaultCancel' }}
          className="Modal__footer__cancel"
          onClick={closeModal}
        />
      )}
      <div className="Modal__footer__actions">{children}</div>
    </div>
  );
});

export default Object.assign(Modal, {
  Body,
  Footer,
});
