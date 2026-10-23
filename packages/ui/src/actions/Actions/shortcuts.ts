// The keys of a shortcut: the types, the check at registration, the match
// with a key press and the labels.

const LETTERS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
] as const;

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

const FUNCTION_KEYS = [
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
  'f12',
] as const;

type Letter = (typeof LETTERS)[number];
type Digit = (typeof DIGITS)[number];

type FunctionKey = (typeof FUNCTION_KEYS)[number];

/**
 * A key. A letter, a digit or a sign matches the character that the layout of
 * the user types. When the layout types a character that is not ASCII
 * (Cyrillic, Greek), it matches the key at that place on a US keyboard.
 */
export type ShortcutKey =
  | Letter
  | Digit
  | FunctionKey
  | 'enter'
  | 'escape'
  | 'space'
  | 'tab'
  | 'backspace'
  | 'delete'
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'
  | 'home'
  | 'end'
  | 'pageup'
  | 'pagedown'
  | '/'
  | '.'
  | ','
  | ';'
  | "'"
  | '['
  | ']'
  | '\\'
  | '-'
  | '='
  | '`'
  | '?';

/** One key, with its modifiers */
export type KeyShortcut = {
  /** The key */
  key: ShortcutKey;
  /** Cmd on a Mac, Ctrl on the other systems */
  mod?: boolean;
  shift?: boolean;
  /** Option on a Mac */
  alt?: boolean;
  /**
   * The shortcut also works while the focus is in a text field. It must
   * have `mod`: a key without it types a character.
   */
  runWithInputFocus?: boolean;
};

/** Two keys, one after the other, with no modifier (`G` then `S`) */
export type SequenceShortcut = {
  /** The first key and the second key */
  key: readonly [ShortcutKey, ShortcutKey];
  mod?: never;
  shift?: never;
  alt?: never;
  runWithInputFocus?: never;
};

/**
 * The keys of an action: `{ key: 'p' }`, `{ key: 's', mod: true }` or
 * `{ key: ['g', 's'] }`.
 */
export type ActionShortcut = KeyShortcut | SequenceShortcut;

const SPECIAL_CODES: Record<string, string[]> = {
  enter: ['Enter', 'NumpadEnter'],
  escape: ['Escape'],
  space: ['Space'],
  tab: ['Tab'],
  backspace: ['Backspace'],
  delete: ['Delete'],
  arrowup: ['ArrowUp'],
  arrowdown: ['ArrowDown'],
  arrowleft: ['ArrowLeft'],
  arrowright: ['ArrowRight'],
  home: ['Home'],
  end: ['End'],
  pageup: ['PageUp'],
  pagedown: ['PageDown'],
  '/': ['Slash'],
  '.': ['Period'],
  ',': ['Comma'],
  ';': ['Semicolon'],
  "'": ['Quote'],
  '[': ['BracketLeft'],
  ']': ['BracketRight'],
  '\\': ['Backslash'],
  '-': ['Minus'],
  '=': ['Equal'],
  '`': ['Backquote'],
};

function isLetter(key: string): key is Letter {
  return (LETTERS as readonly string[]).includes(key);
}

function isNamedKey(key: string) {
  return (
    (FUNCTION_KEYS as readonly string[]).includes(key) ||
    /^[a-z]{2,}$/.test(key)
  );
}

/** A character from Space to `~`: the letters, the digits and the signs */
function isAsciiCharacter(value: string) {
  return value.length === 1 && value >= ' ' && value <= '~';
}

function codesOf(key: ShortcutKey): string[] {
  if (isLetter(key)) return [`Key${key.toUpperCase()}`];
  if ((DIGITS as readonly string[]).includes(key)) return [`Digit${key}`];
  if ((FUNCTION_KEYS as readonly string[]).includes(key)) {
    return [key.toUpperCase()];
  }
  return SPECIAL_CODES[key] ?? [];
}

function isKnownKey(key: string): key is ShortcutKey {
  return key === '?' || codesOf(key as ShortcutKey).length > 0;
}

export function isSequence(
  shortcut: ActionShortcut,
): shortcut is SequenceShortcut {
  return Array.isArray(shortcut.key);
}

export function toList(
  shortcut: ActionShortcut | ActionShortcut[] | undefined,
) {
  if (!shortcut) return [];
  return Array.isArray(shortcut) ? shortcut : [shortcut];
}

/**
 * The reason why the registry refuses a shortcut, or undefined. The browser
 * does not let a page cancel some keys on some systems, thus they never
 * reach the page.
 */
export function shortcutProblem(shortcut: ActionShortcut): string | undefined {
  if (isSequence(shortcut)) {
    if (shortcut.key.length !== 2) return 'a sequence has exactly two keys';
    if (shortcut.mod || shortcut.shift || shortcut.alt) {
      return 'a sequence has no modifiers';
    }
    if (shortcut.runWithInputFocus) {
      return 'a sequence does not work in a text field';
    }
    const unknown = shortcut.key.find((key) => !isKnownKey(key));
    return unknown === undefined ? undefined : `"${unknown}" is not a key`;
  }

  const { key, mod, shift, alt, runWithInputFocus } = shortcut;

  if (!isKnownKey(key)) return `"${key}" is not a key`;
  if (runWithInputFocus && !mod) {
    return 'a shortcut with runWithInputFocus needs mod';
  }
  if (mod && !alt && !shift && ['n', 't', 'w'].includes(key)) {
    return 'the browser keeps mod+N, mod+T and mod+W';
  }
  if (mod && !alt && shift && ['n', 't'].includes(key)) {
    return 'the browser keeps mod+Shift+N and mod+Shift+T';
  }
  if (alt && !mod && !shift && isLetter(key)) {
    return 'Alt+letter opens the menu bar on Windows';
  }
  return undefined;
}

const KEY_ALIASES: Record<string, ShortcutKey> = {
  esc: 'escape',
  return: 'enter',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  del: 'delete',
};

/**
 * The keys of a string in the format of `is-hotkey` ("mod+shift+s"), or
 * undefined when the string has a key that a shortcut does not know. The
 * text editors give their keys in this format.
 */
export function parseShortcut(hotKey: string): KeyShortcut | undefined {
  const parts = hotKey.toLowerCase().split('+');
  const last = parts.pop() ?? '';
  const key = KEY_ALIASES[last] ?? last;
  if (!isKnownKey(key)) return undefined;

  const shortcut: KeyShortcut = { key };
  for (const part of parts) {
    if (['mod', 'cmd', 'command', 'meta', 'ctrl', 'control'].includes(part)) {
      shortcut.mod = true;
    } else if (part === 'shift') {
      shortcut.shift = true;
    } else if (['alt', 'option', 'opt'].includes(part)) {
      shortcut.alt = true;
    } else {
      return undefined;
    }
  }
  return shortcut;
}

/** A key press, without the event: the buffer of a sequence keeps it */
export type Stroke = {
  code: string;
  key: string;
  mod: boolean;
  shift: boolean;
  alt: boolean;
  /** The modifier that is not `mod`: Ctrl on a Mac, Cmd elsewhere */
  other: boolean;
};

export function strokeOf(event: KeyboardEvent, mac: boolean): Stroke {
  return {
    code: event.code,
    key: event.key,
    mod: mac ? event.metaKey : event.ctrlKey,
    other: mac ? event.ctrlKey : event.metaKey,
    shift: event.shiftKey,
    alt: event.altKey,
  };
}

const MODIFIER_CODES = /^(Shift|Control|Alt|Meta|OS)(Left|Right)?$|^CapsLock$/;

export function isModifierOnly(stroke: Stroke) {
  return MODIFIER_CODES.test(stroke.code);
}

/** The stroke is a key with no modifier: it can start a sequence */
export function isPlain(stroke: Stroke) {
  return !stroke.mod && !stroke.other && !stroke.alt && !stroke.shift;
}

function keyMatches(
  key: ShortcutKey,
  modifiers: { mod?: boolean; shift?: boolean; alt?: boolean },
  stroke: Stroke,
) {
  if (stroke.other || stroke.mod !== Boolean(modifiers.mod)) return false;
  if (stroke.alt !== Boolean(modifiers.alt)) return false;
  // Shift makes "?" on most layouts, thus "?" ignores it
  if (key === '?') return stroke.key === '?';
  if (matchesCharacter(key, modifiers, stroke)) {
    const character = stroke.key.toLowerCase();
    // A layout can need Shift to type a digit or a sign ("/" on an Italian
    // keyboard), thus only a letter checks Shift
    return isLetter(key)
      ? character === key && stroke.shift === Boolean(modifiers.shift)
      : character === key;
  }
  if (stroke.shift !== Boolean(modifiers.shift)) return false;
  return codesOf(key).includes(stroke.code);
}

/**
 * The shortcut compares the character of the stroke, not the physical key.
 * We do not compare the physical key when the layout types an ASCII
 * character, because on an Italian keyboard Cmd + "-" is at the place of
 * the US "/", and Cmd + "/" then takes the zoom out of the browser.
 */
function matchesCharacter(
  key: ShortcutKey,
  modifiers: { shift?: boolean },
  stroke: Stroke,
) {
  if (isNamedKey(key) || !isAsciiCharacter(stroke.key)) return false;
  // Option changes the character on a Mac ("ß" for S), and Shift changes
  // the character of a digit or of a sign ("<" for ","): we cannot know it
  if (stroke.alt) return false;
  return isLetter(key) || !modifiers.shift;
}

/** The shortcut matches the last stroke, or the last two for a sequence */
export function shortcutMatches(
  shortcut: ActionShortcut,
  stroke: Stroke,
  previous: Stroke | undefined,
) {
  if (isSequence(shortcut)) {
    return (
      previous !== undefined &&
      keyMatches(shortcut.key[0], {}, previous) &&
      keyMatches(shortcut.key[1], {}, stroke)
    );
  }
  return keyMatches(shortcut.key, shortcut, stroke);
}

/** The stroke is the first key of the sequence */
export function sequenceStartsWith(shortcut: ActionShortcut, stroke: Stroke) {
  return isSequence(shortcut) && keyMatches(shortcut.key[0], {}, stroke);
}

// We read the deprecated navigator.platform with the test of is-hotkey: the
// text editors listen with is-hotkey, and their labels must show the key
// that it listens to for "mod".
export function isMac() {
  return (
    typeof window !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
  );
}

const KEY_LABELS: Record<string, string> = {
  enter: '↵',
  escape: 'Esc',
  space: 'Space',
  tab: 'Tab',
  backspace: '⌫',
  delete: 'Del',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  home: 'Home',
  end: 'End',
  pageup: 'PgUp',
  pagedown: 'PgDn',
};

const SPOKEN_KEYS: Record<string, string> = {
  enter: 'Enter',
  escape: 'Escape',
  backspace: 'Backspace',
  delete: 'Delete',
  arrowup: 'Up Arrow',
  arrowdown: 'Down Arrow',
  arrowleft: 'Left Arrow',
  arrowright: 'Right Arrow',
  pageup: 'Page Up',
  pagedown: 'Page Down',
};

/** A key as the keycap and as a screen reader says it */
export type KeyLabel = { visible: string; spoken: string };

function keyLabel(key: ShortcutKey): KeyLabel {
  const visible = KEY_LABELS[key] ?? key.toUpperCase();
  return { visible, spoken: SPOKEN_KEYS[key] ?? visible };
}

/**
 * The keys of each stroke of a shortcut, in the order of the system:
 * ⌥ ⇧ ⌘ on a Mac, Ctrl Alt Shift elsewhere.
 */
export function strokeLabels(
  shortcut: ActionShortcut,
  mac: boolean,
): KeyLabel[][] {
  if (isSequence(shortcut)) return shortcut.key.map((key) => [keyLabel(key)]);

  const { key, mod, shift, alt } = shortcut;
  const labels: KeyLabel[] = [];
  const add = (on: boolean | undefined, visible: string, spoken: string) => {
    if (on) labels.push({ visible, spoken });
  };

  if (mac) {
    add(alt, '⌥', 'Option');
    add(shift, '⇧', 'Shift');
    add(mod, '⌘', 'Command');
  } else {
    add(mod, 'Ctrl', 'Ctrl');
    add(alt, 'Alt', 'Alt');
    add(shift, 'Shift', 'Shift');
  }
  labels.push(keyLabel(key));

  return [labels];
}
