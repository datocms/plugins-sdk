import { RenderItemFormOutletMethods } from '.';
import {
  InitMethods,
  OnBootMethods,
  RenderPageMethods,
  RenderFieldExtensionMethods,
  RenderConfigScreenMethods,
  RenderManualFieldExtensionConfigScreenMethods,
  RenderSidebarPanelMethods,
  RenderModalMethods,
  RenderAssetSourceMethods,
} from './types';

export type Parent = { getSettings: () => Promise<{ mode: string }> };

function buildGuard<P extends Parent>(mode: string) {
  return (parent: Parent, settings: { mode: string }): parent is P =>
    settings.mode === mode;
}

export const isInitParent = buildGuard<InitMethods>('init');

export const isOnBootParent = buildGuard<OnBootMethods>('onBoot');

export const isRenderPageParent = buildGuard<RenderPageMethods>('renderPage');

export const isRenderConfigScreenParent = buildGuard<RenderConfigScreenMethods>(
  'renderConfigScreen',
);

export const isRenderModalParent = buildGuard<RenderModalMethods>(
  'renderModal',
);

export const isRenderSidebarPanelParent = buildGuard<RenderSidebarPanelMethods>(
  'renderItemFormSidebarPanel',
);

export const isRenderItemFormOutletParent = buildGuard<RenderItemFormOutletMethods>(
  'renderItemFormOutlet',
);

export const isRenderFieldExtensionParent = buildGuard<RenderFieldExtensionMethods>(
  'renderFieldExtension',
);

export const isRenderManualFieldExtensionConfigScreenParent = buildGuard<RenderManualFieldExtensionConfigScreenMethods>(
  'renderManualFieldExtensionConfigScreen',
);

export const isRenderAssetSourceParent = buildGuard<RenderAssetSourceMethods>(
  'renderAssetSource',
);
