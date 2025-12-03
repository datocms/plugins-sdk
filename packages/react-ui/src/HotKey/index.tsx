import * as React from 'react';
import styles from './styles.module.css.json';

const isMac = navigator.platform.indexOf('Mac') > -1;
const modifierKey = isMac ? '⌘' : 'Ctrl';

export type HotKeyProps = {
  /**
   * Keyboard shortcut string. Use "mod" for platform-specific modifier (Cmd on Mac, Ctrl elsewhere).
   * Separate keys with "+". Examples: "mod+s", "mod+shift+p", "alt+enter"
   */
  hotkey: string;
  /** Optional label to display before the key combination */
  label?: string;
};

/**
 * HotKey component displays keyboard shortcuts in a platform-aware format.
 *
 * The component automatically detects the user's platform and renders appropriate
 * modifier key symbols (⌘ for Mac, Ctrl for Windows/Linux).
 *
 * @example Basic usage
 *
 * Display a simple keyboard shortcut without a label:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <HotKey hotkey="mod+s" />
 * </Canvas>;
 * ```
 *
 * @example With label
 *
 * Include a descriptive label to explain what the keyboard shortcut does:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <HotKey hotkey="mod+s" label="Save" />
 * </Canvas>;
 * ```
 *
 * @example Multiple hotkeys
 *
 * Display a list of keyboard shortcuts with labels for documenting available commands:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
 *     <HotKey hotkey="mod+c" label="Copy" />
 *     <HotKey hotkey="mod+v" label="Paste" />
 *     <HotKey hotkey="mod+shift+z" label="Redo" />
 *     <HotKey hotkey="alt+enter" label="Submit" />
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example Platform-specific rendering
 *
 * The component automatically adapts modifier keys based on the user's platform:
 * - `mod` renders as `⌘` on Mac and `Ctrl` on Windows/Linux
 * - `alt` renders as `⌥` on Mac and `Alt` on Windows/Linux
 *
 * This ensures the correct symbols are displayed for the user's operating system:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
 *     <HotKey hotkey="mod+k" label="Open command palette" />
 *     <HotKey hotkey="alt+enter" label="Submit form" />
 *     <HotKey hotkey="mod+alt+f" label="Find and replace" />
 *   </div>
 * </Canvas>;
 * ```
 */
export function HotKey({ hotkey, label }: HotKeyProps) {
  const keys = hotkey
    .replace('mod', modifierKey)
    .replace('alt', isMac ? '⌥' : 'Alt')
    .split(/\+/)
    .map((e) => e.charAt(0).toUpperCase() + e.slice(1));

  return (
    <div className={styles.hotKey}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.keys}>
        {keys.map((key) => (
          <span key={key} className={styles.hotKeyKey}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}
