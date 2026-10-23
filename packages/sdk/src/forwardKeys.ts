/** The part of a key press that the host needs to run its shortcut */
export type ForwardedKeyDown = Pick<
  KeyboardEvent,
  'key' | 'code' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'repeat'
> & {
  /** The key comes from a text field of the plugin */
  inField: boolean;
};

const MODIFIER_KEYS = new Set(['Alt', 'Control', 'Meta', 'Shift']);

const NOT_TEXT_INPUTS = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

function isTextField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement) {
    return !NOT_TEXT_INPUTS.has(target.type);
  }
  return (
    target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
  );
}

// The host opens its command palette with ⌘K on a Mac and with Ctrl+K on
// the other platforms, also in a text field
function isPaletteKey(event: KeyboardEvent) {
  const mac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  return (
    (mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.code === 'KeyK'
  );
}

function toForwarded(event: KeyboardEvent, inField: boolean): ForwardedKeyDown {
  const { key, code, altKey, ctrlKey, metaKey, shiftKey, repeat } = event;
  return { key, code, altKey, ctrlKey, metaKey, shiftKey, repeat, inField };
}

/**
 * Sends to the host the key presses that the plugin does not handle, thus
 * the shortcuts of the host also work while the plugin has the focus. A
 * plugin handles a key when it calls `preventDefault` on the event. The key
 * of the command palette always goes to the host. In a text field, only the
 * keys with ⌘ or Ctrl go to the host. A host without the shortcuts does not
 * give `forwardKeyDown`.
 */
export function forwardUnhandledKeys(
  forwardKeyDown: ((event: ForwardedKeyDown) => unknown) | undefined,
) {
  if (typeof forwardKeyDown !== 'function') return;

  window.addEventListener('keydown', (event) => {
    // 229 is the key code of a key press that an input method takes
    if (event.isComposing || event.keyCode === 229) return;
    if (MODIFIER_KEYS.has(event.key)) return;
    // The target of an event from a shadow root is its host element
    const inField = isTextField(event.composedPath()[0] ?? event.target);
    if (inField && !event.metaKey && !event.ctrlKey) return;

    // The browser default of this key (the search of the address bar) runs
    // before the host gets it, thus the plugin cancels it here
    if (isPaletteKey(event) && !event.defaultPrevented) {
      event.preventDefault();
      forwardKeyDown(toForwarded(event, inField));
      return;
    }

    // The listeners of the plugin can run after this one. The timeout reads
    // the event after all of them.
    setTimeout(() => {
      if (!event.defaultPrevented) forwardKeyDown(toForwarded(event, inField));
    }, 0);
  });
}
