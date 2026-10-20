import { isHotkey } from 'is-hotkey-esm';
import { groupBy, isEqual } from 'lodash-es';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import NewZIndex from '../overlays/NewZIndex';
import Portal from '../overlays/Portal';
import Tooltip, { type TooltipProps } from '../overlays/Tooltip';
import randomKey from '../utils/randomKey';
import {
  type ActiveHotKeysType,
  type Callback,
  HotKeyContext,
  type HotKeyContextType,
  type HotKeyDefinition,
  HotKeyManagerContext,
  type StackDefinition,
} from './hotKeyContext';

// Whether the root stack (the page) has another stack on top of it. It is its
// own context, holding a plain boolean, so that its consumers don't re-render
// every time a hotkey is registered.
const IsRootCoveredContext = React.createContext(false);

export const useIsRootCovered = () => useContext(IsRootCoveredContext);

type State = {
  stacks: StackDefinition[];
  hotKeys: HotKeyDefinition[];
};

export type HotKeyStackProps = {
  /** The part of the page that has its own keys, for example a dialog. */
  children: React.ReactNode;
  /**
   * The priority of the stack. By default it is one more than the priority
   * of the stack around it. Modal, FullscreenModal and Confirm set the
   * priority of their dialog layer: a dialog that opens later is above the
   * others, also when it is not inside them in the tree.
   */
  forceStackPriority?: number;
};

/**
 * A layer of keys. While it is mounted, only its own HotKeyListener
 * elements work, and the ones of the layers below do not. A dialog is a
 * stack.
 */
export function HotKeyStack({
  children,
  forceStackPriority,
}: HotKeyStackProps) {
  const { pushStack } = useContext(HotKeyManagerContext);
  const id = useMemo(() => randomKey(), []);
  const contextValue = useContext(HotKeyContext);
  const newContextValue = useMemo<HotKeyContextType>(
    () => ({
      currentStackId: id,
      currentStackPriority:
        forceStackPriority !== undefined
          ? forceStackPriority
          : contextValue.currentStackPriority + 1,
      currentListenerPriority: 0,
      currentListenerDeets: undefined,
    }),
    [
      contextValue.currentStackId,
      contextValue.currentStackPriority,
      forceStackPriority,
    ],
  );

  useEffect(() => {
    return pushStack({ id, priority: newContextValue.currentStackPriority });
  }, [id, newContextValue.currentStackPriority]);

  return (
    <HotKeyContext.Provider value={newContextValue}>
      {children}
    </HotKeyContext.Provider>
  );
}

function findHighestStack(definitions: StackDefinition[]): StackDefinition {
  const winner = definitions.reduce<StackDefinition | null>(
    (currentWinner, stack) =>
      currentWinner
        ? currentWinner.priority < stack.priority
          ? stack
          : currentWinner
        : stack,
    null,
  );

  if (!winner) {
    throw new Error('This cannot happen!');
  }

  return winner;
}

function findHighestDefinition(definitions: HotKeyDefinition[]) {
  const winner = definitions.reduce<HotKeyDefinition | null>(
    (currentWinner, stack) =>
      currentWinner
        ? currentWinner.priority < stack.priority
          ? stack
          : currentWinner
        : stack,
    null,
  );

  return winner;
}

// The priority of the keys that win over all the other keys
const GLOBAL_PRIORITY = 100000;

/**
 * Listens to the keys of the whole page. Put it once near the root of the
 * app, above every HotKeyListener.
 */
export function HotKeyManager({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({
    stacks: [{ id: 'root', priority: 0 }],
    hotKeys: [],
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const highestStackId = findHighestStack(state.stacks).id;
      const matchingHotKeys = state.hotKeys.filter(
        (d) =>
          (!d.stackId || d.stackId === highestStackId) &&
          isHotkey(d.hotKey, event),
      );
      const winnerDefinition = findHighestDefinition(matchingHotKeys);

      if (winnerDefinition) {
        event.stopImmediatePropagation();
        event.preventDefault();
        winnerDefinition.trigger(event);
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [state]);

  const addHotKey = (definition: HotKeyDefinition) => {
    setState((oldState) => {
      return {
        ...oldState,
        hotKeys: [...oldState.hotKeys, definition],
      };
    });

    return () => {
      setState((oldState) => {
        return {
          ...oldState,
          hotKeys: oldState.hotKeys.filter(
            (d) => d.trigger !== definition.trigger,
          ),
        };
      });
    };
  };

  const pushStack = (definition: StackDefinition) => {
    setState((oldState) => {
      return { ...oldState, stacks: [...oldState.stacks, definition] };
    });

    return () => {
      setState((oldState) => {
        return {
          ...oldState,
          stacks: oldState.stacks.filter((d) => d.id !== definition.id),
        };
      });
    };
  };

  const highestStackId = useMemo(
    () => findHighestStack(state.stacks).id,
    [state.stacks],
  );

  const activeHotKeys = useMemo(() => {
    const matchingHotKeys = state.hotKeys.filter(
      (d) => !d.stackId || d.stackId === highestStackId,
    );
    const byHotKey: Record<string, HotKeyDefinition[]> = groupBy(
      matchingHotKeys,
      (d) => d.hotKey,
    );

    return Object.entries(byHotKey).reduce<Record<string, TextMessage>>(
      (acc, [key, definitions]) => {
        if (definitions.length > 0) {
          acc[key] = findHighestDefinition(definitions)!.description;
        }
        return acc;
      },
      {},
    );
  }, [state]);

  return (
    <HotKeyManagerContext.Provider
      value={{
        addHotKey,
        pushStack,
        activeHotKeys,
      }}
    >
      <IsRootCoveredContext.Provider value={highestStackId !== 'root'}>
        {children}
      </IsRootCoveredContext.Provider>
    </HotKeyManagerContext.Provider>
  );
}

export type HotKeyListenerProps = {
  /**
   * The keys, in the format of `is-hotkey`, for example "mod+s" or
   * "mod+shift+s". "mod" is Cmd on a Mac and Ctrl on other systems.
   */
  hotKey: string;
  /**
   * The text that tells what the keys do, for example
   * `{ id: 'hotkeys.saveRecord' }`. The tooltip and the list of the active
   * keys show it.
   */
  description: TextMessage;
  /**
   * The function that runs when the user presses the keys. When it returns a
   * promise, `children` gets `true` until the promise ends.
   */
  trigger: Callback;
  /**
   * The elements that the keys belong to. A HotKeyTooltip inside shows the
   * keys. Use a function to get `isTriggerPending`, for example to show a
   * spinner on a button.
   */
  children:
    | React.ReactNode
    | ((isTriggerPending: boolean) => React.ReactNode)
    | undefined;
  /**
   * When it is `false`, the keys do nothing and the tooltip does not show
   * them.
   * @default true
   */
  enabled?: boolean;
};

/**
 * Runs `trigger` when the user presses `hotKey`. Of two listeners with the
 * same keys, the one that is nested deeper in the tree wins.
 */
export function HotKeyListener({
  children,
  hotKey,
  enabled = true,
  trigger,
  description: descriptionProp,
}: HotKeyListenerProps) {
  const { addHotKey } = useContext(HotKeyManagerContext);
  const contextValue = useContext(HotKeyContext);
  // A caller gives a new object on each render: keep the first one until
  // the content changes
  const descriptionRef = useRef(descriptionProp);
  if (!isEqual(descriptionRef.current, descriptionProp)) {
    descriptionRef.current = descriptionProp;
  }
  const description = descriptionRef.current;
  const newContextValue = useMemo<HotKeyContextType>(
    () => ({
      currentStackId: contextValue.currentStackId,
      currentStackPriority: contextValue.currentStackPriority,
      currentListenerPriority: contextValue.currentListenerPriority + 1,
      currentListenerDeets: { hotKey, description, enabled },
    }),
    [
      hotKey,
      description,
      enabled,
      contextValue.currentStackId,
      contextValue.currentStackPriority,
      contextValue.currentListenerPriority,
    ],
  );
  const [isTriggerPending, setTriggerPending] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const triggerWrapper: Callback = useCallback(
    async (event: Event) => {
      try {
        setTriggerPending(true);
        return await trigger(event);
      } finally {
        if (isMountedRef.current) {
          setTriggerPending(false);
        }
      }
    },
    [trigger],
  );

  useEffect(() => {
    if (enabled) {
      return addHotKey({
        stackId: newContextValue.currentStackId,
        priority: newContextValue.currentListenerPriority,
        hotKey,
        description,
        trigger: triggerWrapper,
      });
    }

    return undefined;
  }, [
    newContextValue.currentStackId,
    newContextValue.currentListenerPriority,
    hotKey,
    triggerWrapper,
    enabled,
  ]);

  return (
    <HotKeyContext.Provider value={newContextValue}>
      {typeof children === 'function' ? children(isTriggerPending) : children}
    </HotKeyContext.Provider>
  );
}

// We read the deprecated navigator.platform with the test of is-hotkey: the
// label must show the key that is-hotkey listens to for "mod".
const modifierKey =
  typeof window !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
    ? '⌘'
    : 'Ctrl';

// The symbols of the keys that do not show their name
const keySymbols: Record<string, string> = {
  enter: '↵',
  esc: 'Esc',
  escape: 'Esc',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
};

export type HotKeyProps = {
  /**
   * The keys, joined with "+", for example "mod+enter" or "esc". "mod" is
   * Cmd on a Mac and Ctrl on other systems. Enter, Esc and the arrows show
   * as symbols.
   */
  hotkey: string;
};

/** The keys of a shortcut, drawn as small keycaps. */
export function HotKey({ hotkey }: HotKeyProps) {
  const keys = hotkey
    .replace(/\bmod\b/g, modifierKey)
    .split(/\+/)
    .map(
      (e) =>
        keySymbols[e.toLowerCase()] || e.charAt(0).toUpperCase() + e.slice(1),
    );

  // A kbd in a kbd is the HTML for a combination of keys. It is phrasing
  // content, thus it can be in a p or a span.
  return (
    <kbd className="HotKey">
      {keys.map((key, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the same key can be twice in a shortcut
        <kbd key={`${index}-${key}`} className="HotKey__key">
          {key}
        </kbd>
      ))}
    </kbd>
  );
}

export type HotKeyTooltipProps = Omit<
  TooltipProps,
  'label' | 'shortcut' | 'long'
> & {
  /**
   * The text of the tooltip, for example the label of an icon-only button.
   * By default it is the description of the HotKeyListener around it.
   */
  label?: Message;
  /**
   * The tooltip does not show, for example while the menu of a trigger is
   * open. The trigger stays in the same place in the tree.
   * @default false
   */
  hidden?: boolean;
};

/**
 * A tooltip with the keys of the HotKeyListener of the trigger. Put the
 * HotKeyListener around it. When there is no listener, or the listener is
 * disabled, the tooltip has no keys, and without `label` it does not show.
 */
export function HotKeyTooltip({ label, hidden, ...props }: HotKeyTooltipProps) {
  const { currentListenerDeets } = useContext(HotKeyContext);
  const { tm } = useTranslation();
  const active = currentListenerDeets?.enabled ? currentListenerDeets : null;

  return (
    <Tooltip
      {...props}
      label={!hidden && (label ?? (active && tm(active.description)))}
      shortcut={active?.hotKey}
    />
  );
}

/**
 * A panel at the top of the page with the active keys. Cmd or Ctrl + \\
 * opens and closes it. Put it once, inside HotKeyManager.
 */
export function HotKeyManagerInfo() {
  const { t, tm } = useTranslation();
  const { activeHotKeys, addHotKey } = useContext(HotKeyManagerContext);

  const [visible, setVisible] = useState(false);

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() =>
    setVisible(false),
  );

  const handleToggleVisibility = useCallback(
    () =>
      setVisible((x) => {
        return !x;
      }),
    [setVisible],
  );

  // The keys of the panel are in no stack, and they win over all the other
  // keys: they work also when a dialog is open. addHotKey changes at each
  // change of the keys, thus it is not a dependency.
  useEffect(
    () =>
      addHotKey({
        priority: GLOBAL_PRIORITY,
        hotKey: 'mod+\\',
        description: { id: 'hotkeys.toggleKeyboardShortcuts' },
        trigger: handleToggleVisibility,
      }),
    [handleToggleVisibility],
  );

  return (
    <>
      {visible && (
        <Portal>
          <NewZIndex>
            {(zIndex) => (
              <div ref={clickOutsideRef}>
                <div className="HotKeyManagerInfo" style={{ zIndex }}>
                  <p className="HotKeyManagerInfo__title">
                    {t('hotkeys.info.title')}
                  </p>
                  {Object.keys(activeHotKeys).length > 0 ? (
                    Object.entries(activeHotKeys).map(
                      ([hotKey, description]) => (
                        <div key={hotKey} className="HotKeyManagerInfo__hotkey">
                          <div className="HotKeyManagerInfo__hotkey__description">
                            {tm(description)}
                          </div>
                          <div>
                            <HotKey hotkey={hotKey} />{' '}
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <p>{t('hotkeys.info.empty')}</p>
                  )}
                </div>
              </div>
            )}
          </NewZIndex>
        </Portal>
      )}
    </>
  );
}
