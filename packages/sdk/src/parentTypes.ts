import {
  InitMethods,
  RenderPageMethods,
  RenderAssetSourceMethods,
  RenderDashboardWidgetMethods,
  RenderFieldExtensionMethods,
  RenderPluginParametersFormMethods,
  RenderManualFieldExtensionParametersFormMethods,
  RenderSidebarPaneMethods,
  RenderModalMethods,
  InitMeta,
  RenderPageMeta,
  RenderAssetSourceMeta,
  RenderDashboardWidgetMeta,
  RenderPluginParametersFormMeta,
  RenderModalMeta,
  RenderSidebarPaneMeta,
  RenderFieldExtensionMeta,
  RenderManualFieldExtensionParametersFormMeta,
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

export const isRenderPluginParametersFormParent = buildGuard<RenderPluginParametersFormMethods>(
  'renderPluginParametersForm',
);
export type RenderPluginParametersFormMetaAndMethods = RenderPluginParametersFormMethods &
  RenderPluginParametersFormMeta;

export const isRenderModalParent = buildGuard<RenderModalMethods>('renderModal');
export type RenderModalMetaAndMethods = RenderModalMethods & RenderModalMeta;

export const isRenderSidebarPaneParent = buildGuard<RenderSidebarPaneMethods>('renderSidebarPane');
export type RenderSidebarPaneMetaAndMethods = RenderSidebarPaneMethods & RenderSidebarPaneMeta;

export const isRenderFieldExtensionParent = buildGuard<RenderFieldExtensionMethods>(
  'renderFieldExtension',
);
export type RenderFieldExtensionMetaAndMethods = RenderFieldExtensionMethods &
  RenderFieldExtensionMeta;

export const isRenderManualFieldExtensionParametersFormParent = buildGuard<RenderManualFieldExtensionParametersFormMethods>(
  'renderManualFieldExtensionParametersForm',
);
export type RenderManualFieldExtensionParametersFormMetaAndMethods = RenderManualFieldExtensionParametersFormMethods &
  RenderManualFieldExtensionParametersFormMeta;
