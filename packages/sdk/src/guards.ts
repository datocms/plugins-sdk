import type { RenderItemFormOutletMethods } from '.';
import type {
  OnBootMethods,
  RenderAssetSourceMethods,
  RenderConfigScreenMethods,
  RenderFieldExtensionMethods,
  RenderManualFieldExtensionConfigScreenMethods,
  RenderModalMethods,
  RenderPageMethods,
  RenderSidebarMethods,
  RenderSidebarPanelMethods,
} from './types';

export type Parent = { getSettings: () => Promise<{ mode: string }> };

function buildGuard<P extends Parent>(mode: string) {
  return (parent: Parent, settings: { mode: string }): parent is P =>
    settings.mode === mode;
}

export const isOnBootParent = buildGuard<OnBootMethods>('onBoot');

export const isRenderPageParent = buildGuard<RenderPageMethods>('renderPage');

export const isRenderConfigScreenParent =
  buildGuard<RenderConfigScreenMethods>('renderConfigScreen');

export const isRenderModalParent =
  buildGuard<RenderModalMethods>('renderModal');

export const isRenderSidebarPanelParent = buildGuard<RenderSidebarPanelMethods>(
  'renderItemFormSidebarPanel',
);

export const isRenderSidebarParent = buildGuard<RenderSidebarMethods>(
  'renderItemFormSidebar',
);

export const isRenderItemFormOutletParent =
  buildGuard<RenderItemFormOutletMethods>('renderItemFormOutlet');

export const isRenderFieldExtensionParent =
  buildGuard<RenderFieldExtensionMethods>('renderFieldExtension');

export const isRenderManualFieldExtensionConfigScreenParent =
  buildGuard<RenderManualFieldExtensionConfigScreenMethods>(
    'renderManualFieldExtensionConfigScreen',
  );

export const isRenderAssetSourceParent =
  buildGuard<RenderAssetSourceMethods>('renderAssetSource');
