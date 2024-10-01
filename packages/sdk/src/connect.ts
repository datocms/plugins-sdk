import type { SchemaTypes } from '@datocms/cma-client';
import connectToParent from 'penpal/lib/connectToParent';
import type {
  ItemFormOutlet,
  RenderItemFormOutletMethods,
  RenderItemFormOutletPropertiesAndMethods,
  StructuredTextCustomBlockStyle,
  StructuredTextCustomMark,
} from '.';
import {
  isOnBootParent,
  isRenderAssetSourceParent,
  isRenderConfigScreenParent,
  isRenderFieldExtensionParent,
  isRenderItemCollectionOutletParent,
  isRenderItemFormOutletParent,
  isRenderManualFieldExtensionConfigScreenParent,
  isRenderModalParent,
  isRenderPageParent,
  isRenderSidebarPanelParent,
  isRenderSidebarParent,
  type Parent,
} from './guards';
import type {
  AssetSource,
  ContentAreaSidebarItem,
  DropdownAction,
  DropdownActionGroup,
  ExecuteFieldDropdownActionPropertiesAndMethods,
  ExecuteItemFormDropdownActionPropertiesAndMethods,
  ExecuteItemsDropdownActionPropertiesAndMethods,
  ExecuteUploadsDropdownActionPropertiesAndMethods,
  FieldDropdownActionsProperties,
  FieldExtensionOverride,
  InitialLocationQueryForItemSelector,
  InitPropertiesAndMethods,
  ItemCollectionOutlet,
  ItemFormDropdownActionsProperties,
  ItemFormSidebar,
  ItemFormSidebarPanel,
  ItemPresentationInfo,
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
  RenderItemCollectionOutletMethods,
  RenderItemCollectionOutletPropertiesAndMethods,
  RenderManualFieldExtensionConfigScreenMethods,
  RenderManualFieldExtensionConfigScreenPropertiesAndMethods,
  RenderModalMethods,
  RenderModalPropertiesAndMethods,
  RenderPageMethods,
  RenderPagePropertiesAndMethods,
  RenderSidebarMethods,
  RenderSidebarPanelMethods,
  RenderSidebarPanelPropertiesAndMethods,
  RenderSidebarPropertiesAndMethods,
  SettingsAreaSidebarItemGroup,
} from './types';
import { pick } from './utils';

type Field = SchemaTypes.Field;
type Item = SchemaTypes.Item;
type Upload = SchemaTypes.Upload;
type ItemCreateSchema = SchemaTypes.ItemCreateSchema;
type ItemType = SchemaTypes.ItemType;
type ItemUpdateSchema = SchemaTypes.ItemUpdateSchema;

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

  /** Wheter the auto-resizer is currently active or not */
  isAutoResizerActive(): boolean;
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

export type RenderItemFormSidebarCtx = RenderSidebarPropertiesAndMethods &
  SizingUtilities;

export type RenderItemFormOutletCtx = RenderItemFormOutletPropertiesAndMethods &
  SizingUtilities;

export type RenderFieldExtensionCtx = RenderFieldExtensionPropertiesAndMethods &
  SizingUtilities;

export type RenderManualFieldExtensionConfigScreenCtx =
  RenderManualFieldExtensionConfigScreenPropertiesAndMethods & SizingUtilities;

export type RenderConfigScreenCtx = RenderConfigScreenPropertiesAndMethods &
  SizingUtilities;

export type ItemFormDropdownActionsCtx = ItemFormDropdownActionsProperties;

export type FieldDropdownActionsCtx = FieldDropdownActionsProperties;

export type ExecuteItemFormDropdownActionCtx =
  ExecuteItemFormDropdownActionPropertiesAndMethods;

export type ExecuteFieldDropdownActionCtx =
  ExecuteFieldDropdownActionPropertiesAndMethods;

export type ItemDropdownActionsCtx = InitPropertiesAndMethods & {
  itemType: ItemType;
};

export type ExecuteItemsDropdownActionCtx =
  ExecuteItemsDropdownActionPropertiesAndMethods;

export type ExecuteUploadsDropdownActionCtx =
  ExecuteItemsDropdownActionPropertiesAndMethods;

export type UploadDropdownActionsCtx =
  ExecuteUploadsDropdownActionPropertiesAndMethods;

export type RenderItemCollectionOutletCtx =
  RenderItemCollectionOutletPropertiesAndMethods & SizingUtilities;

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
   * Use this function to customize the presentation of a record in records
   * collections and "Single link" or "Multiple links" field
   *
   * @tag presentation
   */
  buildItemPresentationInfo: (
    item: Item,
    ctx: OnBootCtx,
  ) => MaybePromise<ItemPresentationInfo | undefined>;

  /**
   * Use this function to customize the initial filters when opening an record
   * selector via a "Single link" or "Multiple links" field
   *
   * @tag locationQuery
   */
  initialLocationQueryForItemSelector: (
    openerfield: Item,
    itemType: ItemType,
    ctx: OnBootCtx,
  ) => MaybePromise<InitialLocationQueryForItemSelector | undefined>;

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
  assetSources: (ctx: IntentCtx) => AssetSource[] | undefined;

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
   * Use this function to declare new sidebar to be shown when the user edits
   * records of a particular model
   *
   * @tag sidebarPanels
   */
  itemFormSidebars: (itemType: ItemType, ctx: IntentCtx) => ItemFormSidebar[];

  /**
   * Use this function to declare custom outlets to be shown at the top of the
   * record's editing page
   *
   * @tag itemFormOutlets
   */
  itemFormOutlets: (itemType: ItemType, ctx: IntentCtx) => ItemFormOutlet[];

  itemFormDropdownActions: (
    itemType: ItemType,
    ctx: ItemFormDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;

  executeItemFormDropdownAction: (
    actionId: string,
    ctx: ExecuteItemFormDropdownActionCtx,
  ) => Promise<void>;

  fieldDropdownActions: (
    field: Field,
    ctx: FieldDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;

  executeFieldDropdownAction: (
    actionId: string,
    ctx: ExecuteFieldDropdownActionCtx,
  ) => Promise<void>;

  itemsDropdownActions: (
    itemType: ItemType,
    ctx: ItemDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;

  executeItemsDropdownAction: (
    actionId: string,
    items: Item[],
    ctx: ExecuteItemsDropdownActionCtx,
  ) => Promise<void>;

  uploadsDropdownActions: (
    ctx: UploadDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;

  executeUploadsDropdownAction: (
    actionId: string,
    uploads: Upload[],
    ctx: ExecuteUploadsDropdownActionCtx,
  ) => Promise<void>;

  itemCollectionOutlets: (
    itemType: ItemType,
    ctx: IntentCtx,
  ) => ItemCollectionOutlet[];

  renderItemCollectionOutlet: (
    itemCollectionOutletId: string,
    ctx: RenderItemCollectionOutletCtx,
  ) => void;

  /**
   * Use this function to automatically force one or more field extensions to a
   * particular field
   *
   * @tag forcedFieldExtensions
   */
  overrideFieldExtensions: (
    field: Field,
    ctx: FieldIntentCtx,
  ) => FieldExtensionOverride | undefined;

  /**
   * Use this function to define a number of custom marks for a specific
   * Structured Text field
   *
   * @tag structuredText
   */
  customMarksForStructuredTextField: (
    field: Field,
    ctx: FieldIntentCtx,
  ) => StructuredTextCustomMark[] | undefined;

  /**
   * Use this function to define a number of custom block styles for a specific
   * Structured Text field
   *
   * @tag structuredText
   */
  customBlockStylesForStructuredTextField: (
    field: Field,
    ctx: FieldIntentCtx,
  ) => StructuredTextCustomBlockStyle[] | undefined;

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
   * This function will be called when the plugin needs to render a sidebar (see
   * the `itemFormSidebars` function)
   *
   * @tag sidebarPanels
   */
  renderItemFormSidebar: (
    sidebarId: string,
    ctx: RenderItemFormSidebarCtx,
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

type AwaitedReturnType<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;

function getMaxScrollHeight() {
  const elements = document.querySelectorAll('body *');
  let maxVal = 0;
  for (let i = 0; i < elements.length; i++) {
    maxVal = Math.max(elements[i].getBoundingClientRect().bottom, maxVal);
  }
  return maxVal;
}

const buildRenderUtils = (parent: {
  setHeight: (number: number) => void;
}): SizingUtilities => {
  let oldHeight: null | number = null;

  const updateHeight = (height?: number) => {
    const realHeight =
      height === undefined
        ? Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.getBoundingClientRect().height,
            getMaxScrollHeight(),
          )
        : height;

    if (realHeight !== oldHeight) {
      parent.setHeight(realHeight);
      oldHeight = realHeight;
    }
  };

  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  const onMutation = () => updateHeight();

  const startAutoResizer = () => {
    updateHeight();

    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(onMutation);
      resizeObserver.observe(document.documentElement);
    }

    if (!mutationObserver) {
      mutationObserver = new MutationObserver(onMutation);

      mutationObserver.observe(window.document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  };

  const stopAutoResizer = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  };

  const isAutoResizerActive = () => Boolean(resizeObserver);

  return {
    updateHeight,
    startAutoResizer,
    stopAutoResizer,
    isAutoResizerActive,
  };
};

const hooksWithNoRendering = [
  'assetSources',

  'itemFormOutlets',
  'itemCollectionOutlets',

  'itemFormSidebarPanels',
  'itemFormSidebars',

  'mainNavigationTabs',
  'contentAreaSidebarItems',
  'settingsAreaSidebarItemGroups',

  'manualFieldExtensions',

  'itemFormDropdownActions',
  'executeItemFormDropdownAction',

  'fieldDropdownActions',
  'executeFieldDropdownAction',

  'itemsDropdownActions',
  'executeItemsDropdownAction',

  'uploadsDropdownActions',
  'executeUploadsDropdownAction',
] as const;

export async function connect(
  configuration: Partial<FullConnectParameters> = {},
): Promise<void> {
  let listener: ((newSettings: any) => void) | null = null;
  let callMethodMergingBootCtxExecutor:
    | ((
        methodName: string,
        methodArgs: unknown[],
        extraCtxProperties: Record<string, unknown>,
        methodCallId: string,
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
      ...pick(configuration, hooksWithNoRendering),
      overrideFieldExtensions: toMultifield(
        configuration.overrideFieldExtensions,
      ),
      customMarksForStructuredTextField: toMultifield(
        configuration.customMarksForStructuredTextField,
      ),
      customBlockStylesForStructuredTextField: toMultifield(
        configuration.customBlockStylesForStructuredTextField,
      ),
      onChange(newSettings: unknown) {
        if (listener) {
          listener(newSettings);
        }
      },
      callMethodMergingBootCtx(
        methodName: string,
        methodArgs: unknown[],
        extraCtxProperties: Record<string, unknown>,
        methodCallId: string,
      ) {
        if (!callMethodMergingBootCtxExecutor) {
          return null;
        }
        return callMethodMergingBootCtxExecutor(
          methodName,
          methodArgs,
          extraCtxProperties,
          methodCallId,
        );
      },
    },
  });

  const parent: Parent = await penpalConnection.promise;
  const initialSettings = await parent.getSettings();

  if (isOnBootParent(parent, initialSettings)) {
    type Settings = AwaitedReturnType<OnBootMethods['getSettings']>;
    let currentSettings = initialSettings as Settings;

    listener = (newSettings: Settings) => {
      currentSettings = newSettings;
    };

    callMethodMergingBootCtxExecutor = (
      methodName: string,
      methodArgs: unknown[],
      extraCtxProperties: Record<string, unknown>,
      methodCallId: string,
    ) => {
      if (!(methodName in configuration)) {
        return undefined;
      }

      const ctxCatchingMissingMethods = new Proxy(
        {
          ...parent,
          ...currentSettings,
          ...extraCtxProperties,
        },
        {
          get(target, property, receiver) {
            if (property in target) {
              return Reflect.get(target, property, receiver);
            }

            return (...args: any[]) => {
              return (parent as any).missingMethodOnCtx(
                methodCallId,
                property,
                args,
              );
            };
          },
        },
      );

      return (configuration as any)[methodName](
        ...methodArgs,
        ctxCatchingMissingMethods,
      );
    };

    if (configuration.onBoot) {
      configuration.onBoot({
        ...parent,
        ...currentSettings,
      });
    }
  }

  if (isRenderPageParent(parent, initialSettings)) {
    type Settings = AwaitedReturnType<RenderPageMethods['getSettings']>;

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
    type Settings = AwaitedReturnType<RenderConfigScreenMethods['getSettings']>;

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
    type Settings = AwaitedReturnType<RenderModalMethods['getSettings']>;

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
    type Settings = AwaitedReturnType<RenderAssetSourceMethods['getSettings']>;

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
    type Settings = AwaitedReturnType<RenderSidebarPanelMethods['getSettings']>;

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

  if (isRenderSidebarParent(parent, initialSettings)) {
    type Settings = AwaitedReturnType<RenderSidebarMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderItemFormSidebar) {
        return;
      }

      configuration.renderItemFormSidebar(settings.sidebarId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }

  if (isRenderItemFormOutletParent(parent, initialSettings)) {
    type Settings = AwaitedReturnType<
      RenderItemFormOutletMethods['getSettings']
    >;

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

  if (isRenderItemCollectionOutletParent(parent, initialSettings)) {
    type Settings = AwaitedReturnType<
      RenderItemCollectionOutletMethods['getSettings']
    >;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderItemCollectionOutlet) {
        return;
      }

      configuration.renderItemCollectionOutlet(
        settings.itemCollectionOutletId,
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

  if (isRenderFieldExtensionParent(parent, initialSettings)) {
    type Settings = AwaitedReturnType<
      RenderFieldExtensionMethods['getSettings']
    >;

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
    type Settings = AwaitedReturnType<
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
