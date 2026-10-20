import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HotKeyContext } from '../actions/hotKeyContext';
import { useHostServices } from '../HostServicesProvider';
import { confirmQuestion, confirmTexts } from './confirmQuestion';
import { ZIndexContext } from './NewZIndex';

type CloseListener = () => unknown;

type ModalCloseContextValue = {
  closeModal: ((e?: React.MouseEvent) => Promise<void>) | null;
  addCloseListener: (cb: CloseListener) => () => void;
};

export const ModalCloseContext = React.createContext<ModalCloseContextValue>({
  closeModal: null,
  addCloseListener: () => () => {},
});

type DialogLayer = {
  /** The z-index of the dialog */
  zIndex: number;
  /** The priority of the stack of hotkeys of the dialog */
  hotKeyPriority: number;
};

// The dialogs that are open now
let openDialogLayers: DialogLayer[] = [];

/**
 * Gives a dialog its z-index and its hotkey priority. A dialog shows over its
 * parent layer and over all the dialogs that are open, also when it is not
 * inside them in the React tree (for example a dialog that opens from the
 * root of the app). Thus the last dialog that opens is on top and gets the
 * keys.
 */
export function useDialogLayer(): DialogLayer {
  const parentZIndex = useContext(ZIndexContext);
  const { currentStackPriority } = useContext(HotKeyContext);

  const [layer] = useState<DialogLayer>(() => ({
    zIndex:
      Math.max(parentZIndex, ...openDialogLayers.map((l) => l.zIndex)) + 10,
    hotKeyPriority:
      Math.max(
        currentStackPriority,
        ...openDialogLayers.map((l) => l.hotKeyPriority),
      ) + 1,
  }));

  useLayoutEffect(() => {
    openDialogLayers.push(layer);

    return () => {
      openDialogLayers = openDialogLayers.filter((l) => l !== layer);
    };
  }, [layer]);

  return layer;
}

type UseModalCloseOptions = {
  onClose?: (() => void) | null;
};

/**
 * The focus of a dialog. When the dialog opens, the focus goes to the first
 * element that matches `initialFocus`, or to the dialog. When the dialog
 * closes, the focus goes back to the element that opened it. It also gives
 * the language of that element: the dialog is in a Portal, thus it does not
 * get the `lang` of the page around the trigger.
 */
export function useDialogFocus(initialFocus: string) {
  const [didMount, setDidMount] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [locale, setLocale] = useState<string | undefined>(undefined);

  // This effect runs before the other effects, thus all of them use the same
  // trigger
  useLayoutEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setLocale(
      triggerRef.current?.closest('[lang]')?.getAttribute('lang') ?? undefined,
    );
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!didMount || !dialog || dialog.contains(document.activeElement)) {
      return;
    }

    const target = dialog.querySelector<HTMLElement>(initialFocus) ?? dialog;

    if (target.tabIndex < 0) {
      target.tabIndex = -1;
    }
    target.focus();
  }, [didMount, initialFocus]);

  useEffect(() => {
    const trigger = triggerRef.current;

    setDidMount(true);
    trigger?.blur();

    return () => {
      if (trigger?.isConnected) {
        trigger.focus();
      }
    };
  }, []);

  return { didMount, dialogRef, locale };
}

/**
 * Shared modal close behavior with confirmation listener support.
 *
 * Components can register close listeners via `addCloseListener` that run before
 * the modal closes. If any listener returns a falsy value, the close is blocked.
 * The focus goes to the h1 of the dialog (see `useDialogFocus`).
 */
export function useModalClose({ onClose }: UseModalCloseOptions) {
  const { didMount, dialogRef, locale } = useDialogFocus('h1');
  const closeListenersRef = useRef<CloseListener[]>([]);

  const handleClose = useCallback(
    async (e?: React.MouseEvent | Event) => {
      e?.preventDefault();

      if (!onClose) {
        return;
      }

      const confirmations = await Promise.all(
        closeListenersRef.current.map((cb) => Promise.resolve(cb())),
      );

      if (confirmations.some((c) => !c)) {
        return;
      }

      onClose();
    },
    [onClose],
  );

  const addCloseListener = useCallback((cb: CloseListener) => {
    closeListenersRef.current.push(cb);
    return () => {
      closeListenersRef.current = closeListenersRef.current.filter(
        (c) => c !== cb,
      );
    };
  }, []);

  // The close function is null when the modal cannot close (no onClose)
  const contextValue = useMemo<ModalCloseContextValue>(
    () => ({ closeModal: onClose ? handleClose : null, addCloseListener }),
    [onClose, handleClose, addCloseListener],
  );

  return { didMount, dialogRef, locale, handleClose, contextValue };
}

type ModalPromptProps = {
  when?: boolean;
  message: string;
  /** Runs when the user confirms the close. */
  onConfirm?: () => void;
};

/**
 * Shows a confirmation dialog when the modal is about to close.
 * Place inside a Modal or FullscreenModal to block close until user confirms.
 */
export const ModalPrompt = React.memo(function ModalPrompt({
  when,
  message,
  onConfirm,
}: ModalPromptProps) {
  const { addCloseListener } = useContext(ModalCloseContext);
  const { confirm } = useHostServices();

  useEffect(() => {
    if (!when) {
      return;
    }

    const askForConfirmation = async () => {
      const confirmed = await confirm(confirmQuestion(confirmTexts(message)));

      if (confirmed) {
        onConfirm?.();
      }

      return confirmed;
    };
    const release = addCloseListener(askForConfirmation);

    return release;
  }, [when, message, onConfirm, addCloseListener, confirm]);

  return null;
});
