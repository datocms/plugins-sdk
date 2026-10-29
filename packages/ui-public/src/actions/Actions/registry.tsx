import { isEqual } from 'lodash-es';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Editor } from '../../../icons/index';
import { type HostServices, useHostServices } from '../../HostServicesProvider';
import { type TextMessage } from '../../Message';
import randomKey from '../../utils/randomKey';
import { type SvgIcon } from '../../utils/types';
import {
  type ActionShortcut,
  isMac,
  isModifierOnly,
  isPlain,
  isSequence,
  type Stroke,
  sequenceStartsWith,
  shortcutMatches,
  shortcutProblem,
  strokeOf,
  toList,
} from './shortcuts';

/** What started the action */
export type ActionSource = 'key' | 'menu' | 'palette';

/**
 * The group of an action in the list of the shortcuts, for example
 * "Record" or "List". The list shows the groups in the order of their
 * first action.
 */
export type ActionGroup = {
  /** The stable name of the group, for example `'record'` */
  id: string;
  /** The heading of the group */
  name: TextMessage;
  /** The icon of the actions of the group that have no icon of their own */
  icon?: SvgIcon;
};

/** The group of an action that gives no group */
export const GENERAL_ACTION_GROUP: ActionGroup = {
  id: 'general',
  name: { id: 'actionGroups.general' },
};

/** The group of the actions of a list: the filter, the selection */
export const LIST_ACTION_GROUP: ActionGroup = {
  id: 'list',
  name: { id: 'actionGroups.list' },
  icon: Editor.RecordListIcon,
};

/** A thing that the user can do, with its keys */
export type Action = {
  /**
   * The stable name of the action, for example `'record.publish'`. An
   * action of a more specific level hides the action with the same id of a
   * less specific level.
   */
  id: string;
  /** The text of the tooltip, of the menu row and of the list of keys */
  name: TextMessage;
  /**
   * The icon of the row of the command palette. Without it, the row shows
   * the icon of the group.
   */
  icon?: SvgIcon;
  /**
   * The group of the action in the list of the shortcuts. An action with
   * no group goes in the "General" group.
   */
  group?: ActionGroup;
  /** The keys of the action. Without them, the action runs from a menu. */
  shortcut?: ActionShortcut | ActionShortcut[];
  /** Runs the action */
  run: (context: { source: ActionSource }) => unknown;
  /**
   * Gives `false` when the action does not exist now: the keys do nothing
   * and the action does not show.
   */
  applicable?: () => boolean;
  /**
   * Gives the reason why the action cannot run now. The action still
   * shows, and its keys show the reason in a notification.
   */
  disabledReason?: () => TextMessage | undefined;
  /**
   * The action also works while a dialog is open: its keys run, and the
   * command palette shows it. Use it for the keys that open the command
   * palette and the list of the shortcuts.
   * @default false
   */
  layerSafe?: boolean;
  /**
   * The area of the app that holds the page or the action, for example
   * "Usage" for "By project". The command palette and the list of the
   * shortcuts show it before the name, because a short name is not clear
   * without its menu group.
   */
  parent?: TextMessage;
  /** More words that find the action in the command palette */
  keywords?: string[];
  /**
   * How the command palette shows the action. `searchOnly`: only when the
   * search finds it, not in the list before the user types. `hidden`: never,
   * for the keys that only make sense as keys (Escape that closes a pane).
   * @default 'listed'
   */
  palette?: 'listed' | 'searchOnly' | 'hidden';
};

/**
 * Where an action works: always (`app`), while its page is open (`page`),
 * or while the pointer or the focus is in an element (`region`).
 */
export type ActionLevel = 'app' | 'page' | 'region';

/**
 * A dialog hides all the actions under it, a popover hides the page. A
 * dialog with its own `Main` hides the page, as a popover does.
 */
export type ActionLayerKind = 'dialog' | 'popover';

/** An action as the read hooks give it */
export type ActionInfo = {
  id: string;
  name: TextMessage;
  parent: TextMessage | undefined;
  icon: SvgIcon | undefined;
  group: ActionGroup | undefined;
  /** The keys that the registry accepts */
  shortcuts: ActionShortcut[];
  level: ActionLevel;
  /** The keys of the action work now */
  active: boolean;
  /** The reason why the action cannot run now */
  disabledReason: TextMessage | undefined;
};

/** An action of the command palette, as it was when the palette opened */
export type PaletteAction = ActionInfo & {
  keywords: string[];
  palette: 'listed' | 'searchOnly';
  /**
   * Runs the action, if its component is still mounted and the action
   * still applies. Gives `false` when the action did not run.
   */
  run: () => boolean;
};

type Layer = {
  id: string;
  kind: ActionLayerKind | 'root';
  priority: number;
  order: number;
};

type Region = {
  element: () => Element | null;
  hovered: boolean;
  focused: boolean;
};

type Registration = {
  order: number;
  level: ActionLevel;
  layer: Layer;
  actions: () => readonly Action[];
  region?: Region;
};

type Entry = { action: Action; registration: Registration };

const ROOT_LAYER: Layer = { id: 'root', kind: 'root', priority: 0, order: -1 };

const SEQUENCE_TIMEOUT_MS = 1200;

const LEVEL_RANK: Record<ActionLevel, number> = { app: 0, page: 1, region: 2 };

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

function isTextField(target: Element | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement) {
    return !NOT_TEXT_INPUTS.has(target.type);
  }
  return (
    target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
  );
}

/**
 * A key that an embedded app (the frame of a plugin) did not handle. The
 * host dispatches it on the frame with `data-actions-frame`, and gives
 * `text-field` when the key comes from a text field of the frame.
 */
function frameOf(target: Element | null) {
  const value = target?.getAttribute('data-actions-frame');
  return value === null || value === undefined
    ? undefined
    : { inField: value === 'text-field' };
}

/**
 * The code of the frame can send any key. Thus a key from a frame runs only
 * the actions of the app (the palette, the chords) and the Escape that
 * closes a layer, never an action on the content of the page.
 */
function frameMayRun(entry: Entry, stroke: Stroke) {
  return (
    entry.registration.level === 'app' ||
    (stroke.code === 'Escape' && isPlain(stroke))
  );
}

function isAbove(a: Layer, b: Layer) {
  return (
    a.priority > b.priority || (a.priority === b.priority && a.order > b.order)
  );
}

function contains(outer: Region, inner: Region) {
  const outerElement = outer.element();
  const innerElement = inner.element();
  return (
    outerElement !== null &&
    innerElement !== null &&
    outerElement !== innerElement &&
    outerElement.contains(innerElement)
  );
}

/** `a` wins over `b` when both have the same keys or the same id */
function beats(a: Registration, b: Registration) {
  if (a.layer !== b.layer) return isAbove(a.layer, b.layer);
  if (a.level !== b.level) return LEVEL_RANK[a.level] > LEVEL_RANK[b.level];
  if (a.region && b.region) {
    if (contains(a.region, b.region)) return false;
    if (contains(b.region, a.region)) return true;
    if (a.region.focused !== b.region.focused) return a.region.focused;
  }
  return a.order > b.order;
}

function byPrecedence(a: Entry, b: Entry) {
  if (beats(a.registration, b.registration)) return -1;
  if (beats(b.registration, a.registration)) return 1;
  return 0;
}

function validShortcuts(action: Action) {
  return toList(action.shortcut).filter(
    (shortcut) => shortcutProblem(shortcut) === undefined,
  );
}

class ActionsRegistry {
  private registrations = new Set<Registration>();
  private layers: Layer[] = [];
  private coveringLayerIds = new Set<string>();
  private listeners = new Set<() => void>();
  private nextOrder = 0;
  private buffer:
    | { stroke: Stroke; time: number; target: EventTarget | null }
    | undefined;

  warn: HostServices['warn'] = () => undefined;

  takeOrder() {
    this.nextOrder += 1;
    return this.nextOrder;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    for (const listener of Array.from(this.listeners)) listener();
  }

  add(registration: Registration) {
    this.registrations.add(registration);
    this.notify();
    return () => {
      this.registrations.delete(registration);
      this.notify();
    };
  }

  newLayer(kind: ActionLayerKind, parent: Layer): Layer {
    // A dialog that opens later is on top, also when it is not inside the
    // other dialogs in the tree. A popover is on top of its parent only.
    const base =
      kind === 'dialog'
        ? Math.max(parent.priority, ...this.layers.map((l) => l.priority))
        : parent.priority;
    return { id: randomKey(), kind, priority: base + 1, order: 0 };
  }

  pushLayer(layer: Layer) {
    layer.order = this.takeOrder();
    this.layers.push(layer);
    this.notify();
    return () => {
      this.layers = this.layers.filter((l) => l !== layer);
      this.notify();
    };
  }

  coverPage(layer: Layer) {
    this.coveringLayerIds.add(layer.id);
    this.notify();
    return () => {
      this.coveringLayerIds.delete(layer.id);
      this.notify();
    };
  }

  isPageCovered() {
    return this.layers.some((layer) => this.coveringLayerIds.has(layer.id));
  }

  /**
   * A popover keeps the actions of the app on. A dialog with its own `Main`
   * also does: it is a page in a dialog, for example the project settings.
   */
  private keepsAppActions(layer: Layer) {
    return layer.kind === 'popover' || this.coveringLayerIds.has(layer.id);
  }

  private isActive(entry: Entry) {
    const { action, registration } = entry;
    const { region, layer, level } = registration;

    if (region && !region.hovered && !region.focused) return false;
    if (action.applicable && !action.applicable()) return false;
    // A layer that closes (an animation) is not on: its actions do not run
    if (layer !== ROOT_LAYER && !this.layers.includes(layer)) return false;

    const above = this.layers.filter((l) => isAbove(l, layer));
    if (above.length === 0 || action.layerSafe) return true;
    return level === 'app' && above.every((l) => this.keepsAppActions(l));
  }

  // The filter runs before the sort: a list of rows registers many regions,
  // and the sort compares their elements in the DOM
  private entries(keep: (entry: Entry) => boolean = () => true): Entry[] {
    const entries: Entry[] = [];
    for (const registration of Array.from(this.registrations)) {
      for (const action of registration.actions()) {
        const entry = { action, registration };
        if (keep(entry)) entries.push(entry);
      }
    }
    return entries.sort(byPrecedence);
  }

  /** The active actions, the winner first. A winner hides its id below. */
  activeEntries() {
    const seen = new Set<string>();
    const inActiveRegion = ({ registration: { region } }: Entry) =>
      !region || region.hovered || region.focused;
    return this.entries(inActiveRegion).filter((entry) => {
      if (seen.has(entry.action.id) || !this.isActive(entry)) return false;
      seen.add(entry.action.id);
      return true;
    });
  }

  /**
   * One action for each id, the active one first: the winner among the
   * active actions, else the action that would win. The actions that do not
   * apply now are out.
   */
  listedEntries(): { entry: Entry; active: boolean }[] {
    const active = this.activeEntries();
    const activeIds = new Set(active.map((entry) => entry.action.id));
    const seen = new Set<string>();
    const inactive = this.entries().filter((entry) => {
      const { id, applicable } = entry.action;
      if (activeIds.has(id) || seen.has(id)) return false;
      if (applicable && !applicable()) return false;
      seen.add(id);
      return true;
    });
    return [
      ...active.map((entry) => ({ entry, active: true })),
      ...inactive.map((entry) => ({ entry, active: false })),
    ];
  }

  /**
   * The action with this id: the active one, else the one that would win.
   * A menu runs an action of a region also when the pointer is in the menu.
   * With an `origin` (the dropdown of the menu), only the regions that hold
   * the origin count: each row of a list registers the same ids, and the
   * menu of a row must not run the action of another row, nor a menu out of
   * the rows (the panel of the open row) the action of a row.
   */
  find(
    id: string,
    origin?: Element | null,
  ): { entry: Entry; active: boolean } | undefined {
    const inScope = ({ registration: { region } }: Entry) =>
      !origin || !region || Boolean(region.element()?.contains(origin));
    const candidates = this.entries((e) => e.action.id === id && inScope(e));

    if (origin) {
      const own = candidates.find((e) => e.registration.region);
      if (own) {
        return !own.action.applicable || own.action.applicable()
          ? { entry: own, active: this.isActive(own) }
          : undefined;
      }
    }

    const active = candidates.find((e) => this.isActive(e));
    if (active) return { entry: active, active: true };

    const entry = candidates.find(
      (e) => !e.action.applicable || e.action.applicable(),
    );
    return entry && { entry, active: false };
  }

  run(entry: Entry, source: ActionSource) {
    const reason = entry.action.disabledReason?.();
    if (reason !== undefined) {
      this.warn(reason);
      return false;
    }
    entry.action.run({ source });
    return true;
  }

  /**
   * Runs the action of an entry that the registry gave before. The action
   * comes again from its registration, because the component can render
   * again with a new `run` after the read.
   */
  rerun(entry: Entry, source: ActionSource) {
    const { registration } = entry;
    if (!this.registrations.has(registration)) return false;
    const action = registration.actions().find((a) => a.id === entry.action.id);
    if (!action || (action.applicable && !action.applicable())) return false;
    return this.run({ action, registration }, source);
  }

  handleKeyDown(event: KeyboardEvent, mac: boolean) {
    // 229 is the key code of a key press that an input method takes
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) {
      return;
    }

    const stroke = strokeOf(event, mac);
    if (isModifierOnly(stroke)) return;

    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-actions-ignore]')) return;

    const frame = frameOf(target);
    const inField = frame ? frame.inField : isTextField(target);
    const now = Date.now();
    const buffer = this.buffer;
    const previous =
      !inField &&
      buffer &&
      buffer.target === event.target &&
      now - buffer.time <= SEQUENCE_TIMEOUT_MS
        ? buffer.stroke
        : undefined;
    this.buffer = undefined;

    const entries = frame
      ? this.activeEntries().filter((entry) => frameMayRun(entry, stroke))
      : this.activeEntries();
    const shortcutsOf = (entry: Entry, inside: boolean) =>
      validShortcuts(entry.action).filter(
        (shortcut) => !inside || shortcut.runWithInputFocus,
      );
    const findMatch = (inside: boolean) =>
      (previous &&
        entries.find((entry) =>
          shortcutsOf(entry, inside).some(
            (s) => isSequence(s) && shortcutMatches(s, stroke, previous),
          ),
        )) ||
      entries.find((entry) =>
        shortcutsOf(entry, inside).some(
          (s) => !isSequence(s) && shortcutMatches(s, stroke, undefined),
        ),
      );

    const winner = findMatch(inField);

    if (winner) {
      event.preventDefault();
      if (!event.repeat) this.run(winner, 'key');
      return;
    }

    // The first Escape leaves the field, the next one runs the action
    if (inField && stroke.code === 'Escape' && isPlain(stroke)) {
      if (findMatch(false)) {
        event.preventDefault();
        (target as HTMLElement).blur();
      }
      return;
    }

    const startsSequence =
      !inField &&
      isPlain(stroke) &&
      entries.some((entry) =>
        shortcutsOf(entry, false).some((s) => sequenceStartsWith(s, stroke)),
      );
    if (startsSequence) {
      this.buffer = { stroke, time: now, target: event.target };
    }
  }
}

const RegistryContext = createContext<ActionsRegistry | null>(null);
const LayerContext = createContext<Layer>(ROOT_LAYER);
const PageCoveredContext = createContext(false);

/**
 * Holds the actions and listens to the keys of the whole page. Put it once
 * near the root, inside the host services: a disabled action shows its
 * reason with them. A second provider inside the first does nothing.
 */
export function ActionsProvider({ children }: { children: ReactNode }) {
  const parent = useContext(RegistryContext);

  return parent ? (
    <RegistryContext.Provider value={parent}>
      {children}
    </RegistryContext.Provider>
  ) : (
    <RootActionsProvider>{children}</RootActionsProvider>
  );
}

function RootActionsProvider({ children }: { children: ReactNode }) {
  const [registry] = useState(() => new ActionsRegistry());
  const { warn } = useHostServices();
  const [pageCovered, setPageCovered] = useState(false);

  useEffect(() => {
    registry.warn = warn;
  }, [registry, warn]);

  useEffect(() => {
    const mac = isMac();
    // The listener is on window, in the bubble phase: a component that
    // handles a key first can stop it or call preventDefault.
    const handleKeyDown = (event: KeyboardEvent) =>
      registry.handleKeyDown(event, mac);

    window.addEventListener('keydown', handleKeyDown);
    const updatePageCovered = () => setPageCovered(registry.isPageCovered());
    const unsubscribe = registry.subscribe(updatePageCovered);
    // The layers of the children open before this effect runs
    updatePageCovered();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
    };
  }, [registry]);

  return (
    <RegistryContext.Provider value={registry}>
      <PageCoveredContext.Provider value={pageCovered}>
        {children}
      </PageCoveredContext.Provider>
    </RegistryContext.Provider>
  );
}

/**
 * A layer of actions, for example a dialog. While it is open, the actions
 * under it are off: all of them under a dialog, the page and the regions
 * under a popover. An action with `layerSafe` stays on. A dialog that opens
 * later is on top, also when it is not inside the other dialogs in the tree.
 */
export function ActionLayer({
  kind,
  actions,
  active = true,
  children,
}: {
  /**
   * A dialog hides all the actions under it, a popover hides the page. A
   * dialog with its own `Main` hides the page, as a popover does.
   */
  kind: ActionLayerKind;
  /**
   * The actions of the layer itself, for example Escape that closes the
   * dialog. They are on while the layer is on top.
   */
  actions?: readonly Action[];
  /**
   * The layer is on. A layer that stays in the page while it closes (an
   * animation) gives `false`: the keys under it work again at once.
   * @default true
   */
  active?: boolean;
  /** The content of the layer. Its actions belong to the layer. */
  children: ReactNode;
}) {
  const registry = useContext(RegistryContext);
  const parent = useContext(LayerContext);
  const [layer] = useState<Layer>(() =>
    registry
      ? registry.newLayer(kind, parent)
      : { id: randomKey(), kind, priority: parent.priority + 1, order: 0 },
  );

  // A layout effect: the layer is on before the user can press a key in it
  useLayoutEffect(
    () => (active ? registry?.pushLayer(layer) : undefined),
    [registry, layer, active],
  );

  return (
    <LayerContext.Provider value={layer}>
      {actions && <LayerActions actions={actions} />}
      {children}
    </LayerContext.Provider>
  );
}

function LayerActions({ actions }: { actions: readonly Action[] }) {
  useRegisterActions(actions);
  return null;
}

/** The layer covers the page. Main calls it when it is in a layer. */
export function useLayerCoversPage() {
  const registry = useContext(RegistryContext);
  const layer = useContext(LayerContext);

  useEffect(() => {
    if (!registry || layer === ROOT_LAYER) return;
    return registry.coverPage(layer);
  }, [registry, layer]);
}

/**
 * Whether a layer with its own `Main` covers the page. The host makes the
 * page inert while it does.
 */
export function useIsPageCovered() {
  return useContext(PageCoveredContext);
}

function reportProblem(message: string) {
  if (import.meta.env.DEV) throw new Error(message);
  console.warn(message);
}

/** The props of the actions that the read hooks show */
function signatureOf(actions: readonly Action[]) {
  return JSON.stringify(
    actions.map((action) => [
      action.id,
      action.name,
      action.group,
      action.shortcut,
      action.layerSafe,
      action.keywords,
      action.palette,
      action.applicable ? action.applicable() : true,
      action.disabledReason ? action.disabledReason() : undefined,
    ]),
  );
}

type RegionRef = { readonly current: Element | null };

type RegisterOptions = {
  /**
   * `app`: always on. `page`: on while the component is mounted.
   * @default "page"
   */
  level?: 'app' | 'page';
};

/**
 * Registers actions for the life of the component. With a ref first, the
 * actions are on only while the pointer or the focus is in the element of
 * the ref (a row, a pane, a toolbar). An `undefined` ref gives the page
 * level (a pane part out of a Pane). A region wins over the page, and the
 * page wins over the app. In two nested regions, the inner one wins.
 * Between two registrations of the same level, the later one wins.
 */
export function useRegisterActions(
  actions: readonly Action[],
  options?: RegisterOptions,
): void;
export function useRegisterActions(
  region: RegionRef | undefined,
  actions: readonly Action[],
): void;
export function useRegisterActions(
  first: readonly Action[] | RegionRef | undefined,
  second?: readonly Action[] | RegisterOptions,
) {
  const withRegion = !Array.isArray(first);
  const region = withRegion ? (first as RegionRef | undefined) : undefined;
  const actions = (withRegion ? second : first) as readonly Action[];
  const options = withRegion ? undefined : (second as RegisterOptions);
  const level: ActionLevel = region ? 'region' : (options?.level ?? 'page');

  const registry = useContext(RegistryContext);
  const layer = useContext(LayerContext);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;
  // The order of the render: a component that renders later wins, and a
  // child renders after its parent
  const [order] = useState(() => registry?.takeOrder() ?? 0);
  const signature = signatureOf(actions);
  // An empty list registers nothing: a table registers it for each row
  const isEmpty = actions.length === 0;

  useEffect(() => {
    if (!registry || isEmpty) return;

    const element = region?.current ?? null;
    const regionState: Region | undefined = region && {
      element: () => region.current,
      hovered: element?.matches(':hover') ?? false,
      focused: element?.contains(document.activeElement) ?? false,
    };
    const remove = registry.add({
      order,
      level,
      layer,
      actions: () => actionsRef.current,
      region: regionState,
    });

    if (!regionState || !element) return remove;

    const update = (change: Partial<Pick<Region, 'hovered' | 'focused'>>) => {
      const next = { ...regionState, ...change };
      if (
        next.hovered === regionState.hovered &&
        next.focused === regionState.focused
      ) {
        return;
      }
      Object.assign(regionState, change);
      registry.notify();
    };
    const handleEnter = () => update({ hovered: true });
    const handleLeave = () => update({ hovered: false });
    const handleFocusIn = () => update({ focused: true });
    const handleFocusOut = (event: Event) =>
      update({
        focused: element.contains(
          (event as FocusEvent).relatedTarget as Node | null,
        ),
      });

    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mouseleave', handleLeave);
    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('focusout', handleFocusOut);

    return () => {
      element.removeEventListener('mouseenter', handleEnter);
      element.removeEventListener('mouseleave', handleLeave);
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
      remove();
    };
  }, [registry, layer, level, region, order, isEmpty]);

  useEffect(() => {
    for (const action of actionsRef.current) {
      for (const shortcut of toList(action.shortcut)) {
        const problem = shortcutProblem(shortcut);
        if (problem) {
          reportProblem(
            `The shortcut ${JSON.stringify(shortcut)} of the action "${action.id}" is refused: ${problem}.`,
          );
        }
      }
    }
    if (!isEmpty) registry?.notify();
  }, [registry, signature, isEmpty]);
}

/**
 * A value that the registry gives. The component renders again only when
 * the value changes.
 */
function useRegistryValue<T>(
  select: (registry: ActionsRegistry) => T,
  fallback: T,
  key: unknown,
): T {
  const registry = useContext(RegistryContext);
  const selectRef = useRef(select);
  selectRef.current = select;
  const [value, setValue] = useState(() =>
    registry ? select(registry) : fallback,
  );

  useEffect(() => {
    if (!registry) return;
    const update = () => {
      const next = selectRef.current(registry);
      setValue((current) => (isEqual(current, next) ? current : next));
    };
    update();
    return registry.subscribe(update);
  }, [registry, key]);

  return value;
}

function infoOf(entry: Entry, active: boolean): ActionInfo {
  return {
    id: entry.action.id,
    name: entry.action.name,
    parent: entry.action.parent,
    icon: entry.action.icon,
    group: entry.action.group,
    shortcuts: validShortcuts(entry.action),
    level: entry.registration.level,
    active,
    disabledReason: entry.action.disabledReason?.(),
  };
}

/**
 * The action with this id: the active one, else the one that would win
 * when its region or its page is on. `Button` and `Dropdown.Option` read
 * the name, the keys and the reason with it. With an `origin` in a region
 * that has the id, it gives the action of that region (see `find`).
 */
export function useAction(
  id: string | undefined,
  origin?: Element | null,
): ActionInfo | undefined {
  return useRegistryValue(
    (registry) => {
      const found = id === undefined ? undefined : registry.find(id, origin);
      return found && infoOf(found.entry, found.active);
    },
    undefined,
    id,
  );
}

/**
 * Gives a function that runs an action by its id. A disabled action shows
 * its reason. The function gives `false` when the action did not run. The
 * `source` is `menu` by default. A menu gives the element of its dropdown
 * as `origin` (see `find`).
 */
export function useRunAction() {
  const registry = useContext(RegistryContext);

  return useCallback(
    (
      id: string,
      {
        source = 'menu',
        origin,
      }: { source?: ActionSource; origin?: Element | null } = {},
    ) => {
      const found = registry?.find(id, origin);
      return registry && found ? registry.run(found.entry, source) : false;
    },
    [registry],
  );
}

/** The actions that work now, grouped by level, the winner first */
export function useActiveActions(): Record<ActionLevel, ActionInfo[]> {
  return useRegistryValue(
    (registry) => {
      const groups: Record<ActionLevel, ActionInfo[]> = {
        app: [],
        page: [],
        region: [],
      };
      for (const entry of registry.activeEntries()) {
        groups[entry.registration.level].push(infoOf(entry, true));
      }
      return groups;
    },
    { app: [], page: [], region: [] },
    null,
  );
}

/**
 * One action for each id, the active ones first: the actions that work
 * now, and the actions that work when their region, their page or their
 * layer is on. The list of the shortcuts reads it.
 */
export function useRegisteredActions(): ActionInfo[] {
  return useRegistryValue(
    (registry) =>
      registry
        .listedEntries()
        .map(({ entry, active }) => infoOf(entry, active)),
    [],
    null,
  );
}

/**
 * Gives a function that reads the actions for the command palette: the
 * active actions, the winner first, without the hidden ones. Read them
 * before the palette opens: its dialog turns off the actions under it.
 */
export function useReadPaletteActions() {
  const registry = useContext(RegistryContext);

  return useCallback(
    (): PaletteAction[] =>
      registry
        ? registry.activeEntries().flatMap((entry): PaletteAction[] => {
            const palette = entry.action.palette ?? 'listed';
            if (palette === 'hidden') return [];
            return [
              {
                ...infoOf(entry, true),
                keywords: entry.action.keywords ?? [],
                palette,
                run: () => registry.rerun(entry, 'palette'),
              },
            ];
          })
        : [],
    [registry],
  );
}
