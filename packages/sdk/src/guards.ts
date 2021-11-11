import {
  InitMethods,
  RenderPageMethods,
  RenderFieldExtensionMethods,
  RenderPluginParametersFormMethods,
  RenderManualFieldExtensionParametersFormMethods,
  RenderSidebarPaneMethods,
  RenderModalMethods,
} from './types';

export type Parent = { getSettings: () => Promise<{ mode: string }> };

function buildGuard<P extends Parent>(mode: string) {
  return (parent: Parent, settings: { mode: string }): parent is P => settings.mode === mode;
}

export const isInitParent = buildGuard<InitMethods>('init');

export const isRenderPageParent = buildGuard<RenderPageMethods>('renderPage');

export const isRenderPluginParametersFormParent = buildGuard<RenderPluginParametersFormMethods>(
  'renderPluginParametersForm',
);

export const isRenderModalParent = buildGuard<RenderModalMethods>('renderModal');

export const isRenderSidebarPaneParent = buildGuard<RenderSidebarPaneMethods>('renderSidebarPane');

export const isRenderFieldExtensionParent = buildGuard<RenderFieldExtensionMethods>(
  'renderFieldExtension',
);

export const isRenderManualFieldExtensionParametersFormParent = buildGuard<RenderManualFieldExtensionParametersFormMethods>(
  'renderManualFieldExtensionParametersForm',
);
