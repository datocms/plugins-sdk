import { OnBootMethods } from '.';
import {
  IntentMethods,
  RenderPageMethods,
  RenderFieldExtensionMethods,
  RenderConfigScreenMethods,
  RenderManualFieldExtensionConfigScreenMethods,
  RenderSidebarPanelMethods,
  RenderModalMethods,
} from './types';

export type Parent = { getSettings: () => Promise<{ mode: string }> };

function buildGuard<P extends Parent>(mode: string) {
  return (parent: Parent, settings: { mode: string }): parent is P =>
    settings.mode === mode;
}

export const isIntentParent = buildGuard<IntentMethods>('intent');

export const isOnBootParent = buildGuard<OnBootMethods>('onBoot');

export const isRenderPageParent = buildGuard<RenderPageMethods>('renderPage');

export const isRenderConfigScreenParent = buildGuard<RenderConfigScreenMethods>(
  'renderConfigScreen',
);

export const isRenderModalParent = buildGuard<RenderModalMethods>(
  'renderModal',
);

export const isRenderSidebarPaneParent = buildGuard<RenderSidebarPanelMethods>(
  'renderItemFormSidebarPanel',
);

export const isRenderFieldExtensionParent = buildGuard<RenderFieldExtensionMethods>(
  'renderFieldExtension',
);

export const isRenderManualFieldExtensionConfigScreenParent = buildGuard<RenderManualFieldExtensionConfigScreenMethods>(
  'renderManualFieldExtensionConfigScreen',
);
