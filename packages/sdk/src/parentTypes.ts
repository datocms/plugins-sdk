import {
  AdminPageGroup,
  AssetSource,
  ContentPage,
  DashboardWidget,
  FieldExtension,
  NavigationPage,
  SidebarPane,
} from './definitions';

import {
  ConfigRenderMethods,
  FieldExtensionConfigRenderMethods,
  FieldExtensionRenderCtx,
  ItemFormRenderCtx,
  ItemFormRenderMethods,
  Modal,
  ModalRenderMethods,
  RenderCtx,
  RenderMethods,
} from './types';

export type Parent = { getSettings: () => Promise<{ mode: string }> };

export type PrivateRenderMethods = {
  setHeight: (newHeight: number) => Promise<void>;
};

export function isInitParent(parent: Parent, settings: { mode: string }): parent is InitParent {
  return settings.mode === 'init';
}

export type InitParent = { getSettings: () => Promise<{ mode: 'init' }> };

export function isRenderPageParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderPageParent {
  return settings.mode === 'renderPage';
}

export type RenderPageParent = {
  getSettings: () => Promise<
    {
      mode: 'renderPage';
      pageId: string;
    } & RenderCtx
  >;
} & RenderMethods &
  PrivateRenderMethods;

export function isRenderAssetSourceParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderAssetSourceParent {
  return settings.mode === 'renderAssetSource';
}

export type RenderAssetSourceParent = {
  getSettings: () => Promise<
    {
      mode: 'renderAssetSource';
      assetSource: AssetSource;
    } & RenderCtx
  >;
} & RenderMethods &
  PrivateRenderMethods;

export function isRenderDashboardWidgetParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderDashboardWidgetParent {
  return settings.mode === 'renderDashboardWidget';
}

export type RenderDashboardWidgetParent = {
  getSettings: () => Promise<
    {
      mode: 'renderDashboardWidget';
      dashboardWidget: DashboardWidget;
    } & RenderCtx
  >;
} & RenderMethods &
  PrivateRenderMethods;

export function isRenderConfigParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderConfigParent {
  return settings.mode === 'renderConfig';
}

export type RenderConfigParent = {
  getSettings: () => Promise<
    {
      mode: 'renderConfig';
    } & RenderCtx
  >;
} & ConfigRenderMethods &
  PrivateRenderMethods;

export function isRenderModalParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderModalParent {
  return settings.mode === 'renderModal';
}

export type RenderModalParent = {
  getSettings: () => Promise<
    {
      mode: 'renderModal';
      modal: Modal;
    } & RenderCtx
  >;
} & ModalRenderMethods &
  PrivateRenderMethods;

export function isRenderSidebarPaneParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderSidebarPaneParent {
  return settings.mode === 'renderSidebarPane';
}

export type RenderSidebarPaneParent = {
  getSettings: () => Promise<
    {
      mode: 'renderSidebarPane';
      sidebarPane: SidebarPane;
    } & ItemFormRenderCtx
  >;
} & ItemFormRenderMethods &
  PrivateRenderMethods;

export function isRenderFieldExtensionParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderFieldExtensionParent {
  return settings.mode === 'renderFieldExtension';
}

export type RenderFieldExtensionParent = {
  getSettings: () => Promise<
    {
      mode: 'renderFieldExtension';
      fieldExtension: FieldExtension;
    } & FieldExtensionRenderCtx
  >;
} & ItemFormRenderMethods &
  PrivateRenderMethods;

export function isRenderFieldExtensionConfigParent(
  parent: Parent,
  settings: { mode: string },
): parent is RenderFieldExtensionConfigParent {
  return settings.mode === 'renderFieldExtensionConfig';
}

export type RenderFieldExtensionConfigParent = {
  getSettings: () => Promise<
    {
      mode: 'renderFieldExtensionConfig';
      fieldExtension: FieldExtension;
    } & RenderCtx
  >;
} & FieldExtensionConfigRenderMethods &
  PrivateRenderMethods;
