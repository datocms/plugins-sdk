import connectToParent from 'penpal/lib/connectToParent';
import { Field, ModelBlock } from './SiteApiSchema';
import {
  ConfigRenderMethods,
  FieldExtensionConfigRenderMethods,
  FieldExtensionRenderCtx,
  FieldSetupCtx,
  InitCtx,
  ItemFormRenderCtx,
  ItemFormRenderMethods,
  Modal,
  ModalRenderMethods,
  RenderCtx,
  RenderMethods,
} from './types';

import {
  AdminPage,
  AdminPageGroup,
  AssetSource,
  ContentPage,
  FieldExtension,
  FieldExtensionOverride,
  NavigationPage,
  SidebarPane,
  DashboardWidget,
} from './definitions';

import {
  isInitParent,
  isRenderAssetSourceParent,
  isRenderConfigParent,
  isRenderDashboardWidgetParent,
  isRenderFieldExtensionConfigParent,
  isRenderFieldExtensionParent,
  isRenderModalParent,
  isRenderPageParent,
  isRenderSidebarPaneParent,
  Parent,
  PrivateRenderMethods,
  RenderAssetSourceParent,
  RenderConfigParent,
  RenderDashboardWidgetParent,
  RenderFieldExtensionConfigParent,
  RenderFieldExtensionParent,
  RenderModalParent,
  RenderPageParent,
  RenderSidebarPaneParent,
} from './parentTypes';

type SizingUtilities = {
  startAutoResizer: () => void;
  stopAutoResizer: () => void;
  updateHeight: (newHeight?: number) => void;
};

export type { Field, ModelBlock };

export type PageCtx = RenderCtx & RenderMethods;
export type ModalCtx = RenderCtx & ModalRenderMethods & SizingUtilities;
export type ItemFormCtx = ItemFormRenderCtx & ItemFormRenderMethods & SizingUtilities;
export type FieldExtensionCtx = FieldExtensionRenderCtx & ItemFormRenderMethods & SizingUtilities;
export type FieldExtensionConfigCtx = RenderCtx &
  FieldExtensionConfigRenderMethods &
  SizingUtilities;

type FullConfiguration = {
  dashboardWidgets: (ctx: InitCtx) => DashboardWidget[];
  mainNavigationPages: (ctx: InitCtx) => NavigationPage[];
  adminPageGroups: (ctx: InitCtx) => AdminPageGroup[];
  adminPages: (ctx: InitCtx) => AdminPage[];
  contentPages: (ctx: InitCtx) => ContentPage[];
  manualFieldExtensions: (ctx: InitCtx) => FieldExtension[];
  itemTypeSidebarPanes: (itemType: ModelBlock, ctx: InitCtx) => SidebarPane[];
  overrideFieldExtensions: (field: Field, ctx: FieldSetupCtx) => FieldExtensionOverride | undefined;
  assetSources: (field: Field, ctx: FieldSetupCtx) => AssetSource[];
  renderDashboardWidget: (dashboardWidget: DashboardWidget, ctx: PageCtx) => void;
  renderConfig: (ctx: RenderCtx & ConfigRenderMethods & SizingUtilities) => void;
  renderAssetSource: (assetSource: AssetSource, ctx: PageCtx) => void;
  renderPage: (pageId: string, ctx: PageCtx) => void;
  renderModal: (modal: Modal, ctx: ModalCtx) => void;
  renderSidebarPane: (sidebar: SidebarPane, ctx: ItemFormCtx) => void;
  renderFieldExtension: (extension: FieldExtension, ctx: FieldExtensionCtx) => void;
  renderFieldExtensionConfig: (extension: FieldExtension, ctx: FieldExtensionConfigCtx) => void;
};

function toMultifield<Result>(fn: ((field: Field, ctx: FieldSetupCtx) => Result) | undefined) {
  return (fields: Field[], ctx: InitCtx): Record<string, Result> => {
    if (!fn) {
      return {};
    }

    const result: Record<string, Result> = {};

    for (const field of fields) {
      const itemType = ctx.itemTypes[field.relationships.item_type.data.id] as ModelBlock;
      result[field.id] = fn(field, { ...ctx, itemType });
    }

    return result;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any) => infer U
  ? U
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

const buildRenderUtils = (parent: PrivateRenderMethods) => {
  let oldHeight: null | number = null;

  const updateHeight = (height?: number) => {
    const realHeight =
      height === undefined
        ? Math.ceil(document.documentElement.getBoundingClientRect().height)
        : height;

    if (realHeight !== oldHeight) {
      parent.setHeight(realHeight);
      oldHeight = realHeight;
    }
  };

  let autoResizingActive = false;
  let mutationObserver: MutationObserver | null = null;

  const resetHeight = () => updateHeight();

  const startAutoResizer = () => {
    updateHeight();

    if (autoResizingActive) {
      return;
    }

    autoResizingActive = true;

    mutationObserver = new MutationObserver(resetHeight);

    mutationObserver.observe(window.document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    window.addEventListener('resize', resetHeight);
  };

  const stopAutoResizer = () => {
    if (!autoResizingActive) {
      return;
    }

    autoResizingActive = false;

    if (mutationObserver) {
      mutationObserver.disconnect();
    }

    window.removeEventListener('resize', resetHeight);
  };

  return { updateHeight, startAutoResizer, stopAutoResizer };
};

export async function connect(configuration: Partial<FullConfiguration> = {}): Promise<void> {
  const {
    dashboardWidgets,
    mainNavigationPages,
    adminPageGroups,
    adminPages,
    contentPages,
    manualFieldExtensions,
    itemTypeSidebarPanes,
  } = configuration;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let listener: ((newSettings: any) => void) | null = null;

  const penpalConnection = connectToParent({
    methods: {
      dashboardWidgets,
      mainNavigationPages,
      adminPageGroups,
      adminPages,
      contentPages,
      manualFieldExtensions,
      itemTypeSidebarPanes,
      overrideFieldExtensions: toMultifield(configuration.overrideFieldExtensions),
      assetSources: toMultifield(configuration.assetSources),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange(newSettings: any) {
        if (listener) {
          listener(newSettings);
        }
      },
    },
  });

  const parent: Parent = await penpalConnection.promise;
  const initialSettings = await parent.getSettings();

  if (isInitParent(parent, initialSettings)) {
    // Nothing to do. Parent calls the method they need.
  }

  if (isRenderDashboardWidgetParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderDashboardWidgetParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderDashboardWidget) {
        return;
      }

      configuration.renderDashboardWidget(settings.dashboardWidget, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderPageParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderPageParent['getSettings']>;

    const render = (settings: Settings) => {
      if (!configuration.renderPage) {
        return;
      }

      configuration.renderPage(settings.pageId, {
        ...parent,
        ...settings,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderAssetSourceParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderAssetSourceParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderAssetSource) {
        return;
      }

      configuration.renderAssetSource(settings.assetSource, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderConfigParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderConfigParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderConfig) {
        return;
      }

      configuration.renderConfig({
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderModalParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderModalParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderModal) {
        return;
      }

      configuration.renderModal(settings.modal, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderSidebarPaneParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderSidebarPaneParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderSidebarPane) {
        return;
      }

      configuration.renderSidebarPane(settings.sidebarPane, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderFieldExtensionParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderFieldExtensionParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderFieldExtension) {
        return;
      }

      configuration.renderFieldExtension(settings.fieldExtension, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderFieldExtensionConfigParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderFieldExtensionConfigParent['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderFieldExtensionConfig) {
        return;
      }

      configuration.renderFieldExtensionConfig(settings.fieldExtension, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }
}
