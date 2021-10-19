import {
  InitMethods,
  RenderPageMethods,
  RenderAssetSourceMethods,
  RenderDashboardWidgetMethods,
  RenderFieldExtensionMethods,
  RenderConfigMethods,
  RenderFieldExtensionConfigMethods,
  RenderSidebarPaneMethods,
  RenderModalMethods,
  InitMeta,
  RenderPageMeta,
  RenderAssetSourceMeta,
  RenderDashboardWidgetMeta,
  RenderConfigMeta,
  RenderModalMeta,
  RenderSidebarPaneMeta,
  RenderFieldExtensionMeta,
  RenderFieldExtensionConfigMeta,
} from './types';

export type Parent = { getSettings: () => Promise<{ mode: string }> };

function buildGuard<P extends Parent>(mode: string) {
  return (parent: Parent, settings: { mode: string }): parent is P => settings.mode === mode;
}

export const isInitParent = buildGuard<InitMethods>('init');
export type InitMetaAndMethods = InitMethods & InitMeta;

export const isRenderPageParent = buildGuard<RenderPageMethods>('renderPage');
export type RenderPageMetaAndMethods = RenderPageMethods & RenderPageMeta;

export const isRenderAssetSourceParent = buildGuard<RenderAssetSourceMethods>('renderAssetSource');
export type RenderAssetSourceMetaAndMethods = RenderAssetSourceMethods & RenderAssetSourceMeta;

export const isRenderDashboardWidgetParent = buildGuard<RenderDashboardWidgetMethods>(
  'renderDashboardWidget',
);
export type RenderDashboardWidgetMetaAndMethods = RenderDashboardWidgetMethods &
  RenderDashboardWidgetMeta;

export const isRenderConfigParent = buildGuard<RenderConfigMethods>('renderConfig');
export type RenderConfigMetaAndMethods = RenderConfigMethods & RenderConfigMeta;

export const isRenderModalParent = buildGuard<RenderModalMethods>('renderModal');
export type RenderModalMetaAndMethods = RenderModalMethods & RenderModalMeta;

export const isRenderSidebarPaneParent = buildGuard<RenderSidebarPaneMethods>('renderSidebarPane');
export type RenderSidebarPaneMetaAndMethods = RenderSidebarPaneMethods & RenderSidebarPaneMeta;

export const isRenderFieldExtensionParent = buildGuard<RenderFieldExtensionMethods>(
  'renderFieldExtension',
);
export type RenderFieldExtensionMetaAndMethods = RenderFieldExtensionMethods &
  RenderFieldExtensionMeta;

export const isRenderFieldExtensionConfigParent = buildGuard<RenderFieldExtensionConfigMethods>(
  'renderFieldExtensionConfig',
);
export type RenderFieldExtensionConfigMetaAndMethods = RenderFieldExtensionConfigMethods &
  RenderFieldExtensionConfigMeta;
