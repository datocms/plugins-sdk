import React from 'react';
import { type TextMessage } from '../Message';

// The contexts of the hotkeys. HotKey.tsx and useModalClose.ts use them. This
// module is not in the exports of the package.

export type Callback = (event: Event) => void;

export type ActiveHotKeysType = Record<string, TextMessage>;

export type HotKeyDefinition = {
  stackId?: string;
  priority: number;
  hotKey: string;
  description: TextMessage;
  trigger: Callback;
};

export type StackDefinition = {
  id: string;
  priority: number;
};

export type HotKeyManagerContextValue = {
  addHotKey(definition: HotKeyDefinition): (() => void) | undefined;
  pushStack(stack: StackDefinition): (() => void) | undefined;
  activeHotKeys: ActiveHotKeysType;
};

export type HotKeyContextType = {
  currentListenerPriority: number;
  currentListenerDeets?: {
    hotKey: string;
    description: TextMessage;
    enabled: boolean;
  };
  currentStackId: string;
  currentStackPriority: number;
};

export const HotKeyContext = React.createContext<HotKeyContextType>({
  currentListenerPriority: 0,
  currentListenerDeets: undefined,
  currentStackPriority: 0,
  currentStackId: 'root',
});

export const HotKeyManagerContext =
  React.createContext<HotKeyManagerContextValue>({
    addHotKey: () => undefined,
    pushStack: () => undefined,
    activeHotKeys: {},
  });
