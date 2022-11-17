import connectToParent from 'penpal/lib/connectToParent';
import {
  Field,
  Item,
  ItemCreateSchema,
  ItemType,
  ItemUpdateSchema,
} from './SiteApiSchema';
import {
  AssetSource,
  ContentAreaSidebarItem,
  FieldExtensionOverride,
  InitPropertiesAndMethods,
  ItemFormSidebarPanel,
  MainNavigationTab,
  ManualFieldExtension,
  OnBootMethods,
  OnBootPropertiesAndMethods,
  RenderAssetSourceMethods,
  RenderAssetSourcePropertiesAndMethods,
  RenderConfigScreenMethods,
  RenderConfigScreenPropertiesAndMethods,
  RenderFieldExtensionMethods,
  RenderFieldExtensionPropertiesAndMethods,
  RenderManualFieldExtensionConfigScreenMethods,
  RenderManualFieldExtensionConfigScreenPropertiesAndMethods,
  RenderModalMethods,
  RenderModalPropertiesAndMethods,
  RenderPageMethods,
  RenderPagePropertiesAndMethods,
  RenderSidebarPanelMethods,
  RenderSidebarPanelPropertiesAndMethods,
  SettingsAreaSidebarItemGroup,
} from './types';
import {
  isOnBootParent,
  isRenderAssetSourceParent,
  isRenderConfigScreenParent,
  isRenderFieldExtensionParent,
  isRenderItemFormOutletParent,
  isRenderManualFieldExtensionConfigScreenParent,
  isRenderModalParent,
  isRenderPageParent,
  isRenderSidebarPanelParent,
  Parent,
} from './guards';
import {
  ItemFormOutlet,
  RenderItemFormOutletMethods,
  RenderItemFormOutletPropertiesAndMethods,
  StructuredTextCustomBlockStyle,
  StructuredTextCustomMark,
} from '.';

export type SizingUtilities = {
  /**
   * Listens for DOM changes and automatically calls `setHeight` when it detects
   * a change. If you're using `datocms-react-ui` package, the `<Canvas />`
   * component already takes care of calling this method for you.
   */
  startAutoResizer: () => void;
  /** Stops resizing the iframe automatically */
  stopAutoResizer: () => void;
  /**
   * Triggers a change in the size of the iframe. If you don't explicitely pass
   * a `newHeight` it will be automatically calculated using the iframe content
   * at the moment
   */
  updateHeight: (newHeight?: number) => void;
};

export type { Field, ItemType };

export type IntentCtx = InitPropertiesAndMethods;
export type OnBootCtx = OnBootPropertiesAndMethods;
export type FieldIntentCtx = InitPropertiesAndMethods & {
  itemType: ItemType;
};
export type RenderPageCtx = RenderPagePropertiesAndMethods;
export type RenderModalCtx = RenderModalPropertiesAndMethods & SizingUtilities;
export type RenderAssetSourceCtx = RenderAssetSourcePropertiesAndMethods &
  SizingUtilities;
export type RenderItemFormSidebarPanelCtx =
  RenderSidebarPanelPropertiesAndMethods & SizingUtilities;
export type RenderItemFormOutletCtx = RenderItemFormOutletPropertiesAndMethods &
  SizingUtilities;
export type RenderFieldExtensionCtx = RenderFieldExtensionPropertiesAndMethods &
  SizingUtilities;
export type RenderManualFieldExtensionConfigScreenCtx =
  RenderManualFieldExtensionConfigScreenPropertiesAndMethods & SizingUtilities;
export type RenderConfigScreenCtx = RenderConfigScreenPropertiesAndMethods &
  SizingUtilities;

type MaybePromise<T> = T | Promise<T>;

/** The full options you can pass to the `connect` function */
export type FullConnectParameters = {
  /**
   * This function will be called once at boot time and can be used to perform
   * ie. some initial integrity checks on the configuration.
   *
   * @tag boot
   */
  onBoot: (ctx: OnBootCtx) => void;

  /**
   * This function will be called before destroying records. You can stop the
   * action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemsDestroy: (
    items: Item[],
    ctx: OnBootCtx,
  ) => MaybePromise<boolean>;

  /**
   * This function will be called before publishing records. You can stop the
   * action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemsPublish: (
    items: Item[],
    ctx: OnBootCtx,
  ) => MaybePromise<boolean>;

  /**
   * This function will be called before unpublishing records. You can stop the
   * action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemsUnpublish: (
    items: Item[],
    ctx: OnBootCtx,
  ) => MaybePromise<boolean>;

  /**
   * This function will be called before saving a new version of a record. You
   * can stop the action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemUpsert: (
    createOrUpdateItemPayload: ItemUpdateSchema | ItemCreateSchema,
    ctx: OnBootCtx,
  ) => MaybePromise<boolean>;

  /**
   * Use this function to declare new tabs you want to add in the top-bar of the
   * UI
   *
   * @tag pages
   */
  mainNavigationTabs: (ctx: IntentCtx) => MainNavigationTab[];
  /**
   * Use this function to declare new navigation sections in the Settings Area
   * sidebar
   *
   * @tag pages
   */
  settingsAreaSidebarItemGroups: (
    ctx: IntentCtx,
  ) => SettingsAreaSidebarItemGroup[];
  /**
   * Use this function to declare new navigation items in the Content Area
   * sidebar
   *
   * @tag pages
   */
  contentAreaSidebarItems: (ctx: IntentCtx) => ContentAreaSidebarItem[];
  /**
   * Use this function to declare new field extensions that users will be able
   * to install manually in some field
   *
   * @tag manualFieldExtensions
   */
  manualFieldExtensions: (ctx: IntentCtx) => ManualFieldExtension[];
  /**
   * Use this function to declare additional sources to be shown when users want
   * to upload new assets
   *
   * @tag assetSources
   */
  assetSources: (ctx: IntentCtx) => AssetSource[] | void;
  /**
   * Use this function to declare new sidebar panels to be shown when the user
   * edits records of a particular model
   *
   * @tag sidebarPanels
   */
  itemFormSidebarPanels: (
    itemType: ItemType,
    ctx: IntentCtx,
  ) => ItemFormSidebarPanel[];

  /**
   * Use this function to declare custom outlets to be shown at the top of the
   * record's editing page
   *
   * @tag itemFormOutlets
   */
  itemFormOutlets: (itemType: ItemType, ctx: IntentCtx) => ItemFormOutlet[];

  /**
   * Use this function to automatically force one or more field extensions to a
   * particular field
   *
   * @tag forcedFieldExtensions
   */
  overrideFieldExtensions: (
    field: Field,
    ctx: FieldIntentCtx,
  ) => FieldExtensionOverride | void;

  /**
   * Use this function to define a number of custom marks for a specific
   * Structured Text field
   *
   * @tag structuredText
   */
  customMarksForStructuredTextField: (
    field: Field,
    ctx: FieldIntentCtx,
  ) => StructuredTextCustomMark[] | void;

  /**
   * Use this function to define a number of custom block styles for a specific
   * Structured Text field
   *
   * @tag structuredText
   */
  customBlockStylesForStructuredTextField: (
    field: Field,
    ctx: FieldIntentCtx,
  ) => StructuredTextCustomBlockStyle[] | void;

  /**
   * This function will be called when the plugin needs to render the plugin's
   * configuration form
   *
   * @tag configScreen
   */
  renderConfigScreen: (ctx: RenderConfigScreenCtx) => void;
  /**
   * This function will be called when the plugin needs to render a specific
   * page (see the `mainNavigationTabs`, `settingsAreaSidebarItemGroups` and
   * `contentAreaSidebarItems` functions)
   *
   * @tag pages
   */
  renderPage: (pageId: string, ctx: RenderPageCtx) => void;
  /**
   * This function will be called when the plugin requested to open a modal (see
   * the `openModal` function)
   *
   * @tag modals
   */
  renderModal: (modalId: string, ctx: RenderModalCtx) => void;
  /**
   * This function will be called when the plugin needs to render a sidebar
   * panel (see the `itemFormSidebarPanels` function)
   *
   * @tag sidebarPanels
   */
  renderItemFormSidebarPanel: (
    sidebarPaneId: string,
    ctx: RenderItemFormSidebarPanelCtx,
  ) => void;
  /**
   * This function will be called when the plugin needs to render an outlet (see
   * the `itemFormOutlets` function)
   *
   * @tag itemFormOutlets
   */
  renderItemFormOutlet: (
    itemFormOutletId: string,
    ctx: RenderItemFormOutletCtx,
  ) => void;
  /**
   * This function will be called when the user selects one of the plugin's
   * asset sources to upload a new media file.
   *
   * @tag assetSources
   */
  renderAssetSource: (assetSourceId: string, ctx: RenderAssetSourceCtx) => void;
  /**
   * This function will be called when the plugin needs to render a field
   * extension (see the `manualFieldExtensions` and `overrideFieldExtensions`
   * functions)
   *
   * @tag forcedFieldExtensions
   */
  renderFieldExtension: (
    fieldExtensionId: string,
    ctx: RenderFieldExtensionCtx,
  ) => void;
  /**
   * This function will be called when the plugin needs to render the
   * configuration form for installing a field extension inside a particular
   * field
   *
   * @tag manualFieldExtensions
   */
  renderManualFieldExtensionConfigScreen: (
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) => void;
  /**
   * This function will be called each time the configuration object changes. It
   * must return an object containing possible validation errors
   *
   * @tag manualFieldExtensions
   */
  validateManualFieldExtensionParameters: (
    fieldExtensionId: string,
    parameters: Record<string, unknown>,
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
};

function toMultifield<Result>(
  fn: ((field: Field, ctx: FieldIntentCtx) => Result) | undefined,
) {
  return (
    fields: Field[],
    ctx: InitPropertiesAndMethods,
  ): Record<string, Result> => {
    if (!fn) {
      return {};
    }

    const result: Record<string, Result> = {};

    for (const field of fields) {
      const itemType = ctx.itemTypes[
        field.relationships.item_type.data.id
      ] as ItemType;
      result[field.id] = fn(field, { ...ctx, itemType });
    }

    return result;
  };
}

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

function getMaxScrollHeight() {
  const elements = document.querySelectorAll('body *');
  let maxVal = 0;

  for (let i = 0; i < elements.length; i++) {
    maxVal = Math.max(elements[i].scrollHeight, maxVal);
  }

  return maxVal;
}

const buildRenderUtils = (parent: { setHeight: (number: number) => void }) => {
  let oldHeight: null | number = null;

  const updateHeight = (height?: number) => {
    const realHeight =
      height === undefined
        ? Math.max(
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            getMaxScrollHeight(),
          )
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

export async function connect(
  configuration: Partial<FullConnectParameters> = {},
): Promise<void> {
  const {
    assetSources,
    mainNavigationTabs,
    settingsAreaSidebarItemGroups,
    contentAreaSidebarItems,
    manualFieldExtensions,
    itemFormSidebarPanels,
    itemFormOutlets,
  } = configuration;
  let listener: ((newSettings: any) => void) | null = null;
  let callMethodMergingBootCtxExecutor:
    | ((
        methodName: string,
        methodArgs: any[],
        extraCtx: Record<string, any>,
      ) => void)
    | null = null;

  const penpalConnection = connectToParent({
    methods: {
      sdkVersion: () => '0.2.0',
      implementedHooks: () =>
        Object.fromEntries(
          Object.entries(configuration).map(([key, value]) => {
            if (typeof value === 'function') {
              return [key, true];
            }

            return [key, value];
          }),
        ),
      assetSources,
      mainNavigationTabs,
      settingsAreaSidebarItemGroups,
      contentAreaSidebarItems,
      manualFieldExtensions,
      itemFormSidebarPanels,
      itemFormOutlets,
      overrideFieldExtensions: toMultifield(
        configuration.overrideFieldExtensions,
      ),
      customMarksForStructuredTextField: toMultifield(
        configuration.customMarksForStructuredTextField,
      ),
      customBlockStylesForStructuredTextField: toMultifield(
        configuration.customBlockStylesForStructuredTextField,
      ),
      onChange(newSettings: any) {
        if (listener) {
          listener(newSettings);
        }
      },
      callMethodMergingBootCtx(
        methodName: string,
        methodArgs: any[],
        extraCtx: Record<string, any>,
      ) {
        if (!callMethodMergingBootCtxExecutor) {
          return null;
        }
        return callMethodMergingBootCtxExecutor(
          methodName,
          methodArgs,
          extraCtx,
        );
      },
    },
  });

  const parent: Parent = await penpalConnection.promise;
  const initialSettings = await parent.getSettings();

  if (isOnBootParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<OnBootMethods['getSettings']>;
    let currentSettings = initialSettings as Settings;

    listener = (newSettings: Settings) => {
      currentSettings = newSettings;
    };

    callMethodMergingBootCtxExecutor = (
      methodName: string,
      methodArgs: any[],
      extraCtx: Record<string, any>,
    ) => {
      if (!(methodName in configuration)) {
        return undefined;
      }

      return (configuration as any)[methodName](...methodArgs, {
        ...parent,
        ...currentSettings,
        ...extraCtx,
      });
    };

    if (configuration.onBoot) {
      configuration.onBoot({
        ...parent,
        ...currentSettings,
      });
    }
  }

  if (isRenderPageParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderPageMethods['getSettings']>;

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

  if (isRenderConfigScreenParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderConfigScreenMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderConfigScreen) {
        return;
      }

      configuration.renderConfigScreen({
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderModalParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderModalMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderModal) {
        return;
      }

      configuration.renderModal(settings.modalId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderAssetSourceParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderAssetSourceMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderAssetSource) {
        return;
      }

      configuration.renderAssetSource(settings.assetSourceId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderSidebarPanelParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderSidebarPanelMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderItemFormSidebarPanel) {
        return;
      }

      configuration.renderItemFormSidebarPanel(settings.sidebarPaneId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderItemFormOutletParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderItemFormOutletMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderItemFormOutlet) {
        return;
      }

      configuration.renderItemFormOutlet(settings.itemFormOutletId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderFieldExtensionParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderFieldExtensionMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderFieldExtension) {
        return;
      }

      configuration.renderFieldExtension(settings.fieldExtensionId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderManualFieldExtensionConfigScreenParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<
      RenderManualFieldExtensionConfigScreenMethods['getSettings']
    >;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderManualFieldExtensionConfigScreen) {
        return;
      }

      configuration.renderManualFieldExtensionConfigScreen(
        settings.fieldExtensionId,
        {
          ...parent,
          ...settings,
          ...renderUtils,
        },
      );
    };

    listener = render;
    render(initialSettings as Settings);
  }
}
