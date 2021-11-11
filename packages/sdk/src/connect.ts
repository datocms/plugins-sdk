import connectToParent from 'penpal/lib/connectToParent';
import { Field, ModelBlock } from './SiteApiSchema';
import {
  RenderPluginParametersFormMethods,
  RenderManualFieldExtensionParametersFormMethods,
  RenderSidebarPaneMethods,
  RenderModalMethods,
  SettingsAreaSidebarItemGroup,
  ContentAreaSidebarItem,
  FieldExtension,
  FieldExtensionOverride,
  MainNavigationTab,
  SidebarPane,
  RenderFieldExtensionMethods,
  RenderPageMethods,
  RenderPluginParametersFormPropertiesAndMethods,
  RenderManualFieldExtensionParametersFormPropertiesAndMethods,
  RenderFieldExtensionPropertiesAndMethods,
  RenderModalPropertiesAndMethods,
  RenderPagePropertiesAndMethods,
  RenderSidebarPanePropertiesAndMethods,
  InitPropertiesAndMethods,
} from './types';

import {
  isInitParent,
  isRenderPluginParametersFormParent,
  isRenderManualFieldExtensionParametersFormParent,
  isRenderFieldExtensionParent,
  isRenderModalParent,
  isRenderPageParent,
  isRenderSidebarPaneParent,
  Parent,
} from './guards';

export type SizingUtilities = {
  /** Listens for DOM changes and automatically calls `setHeight` when it detects a change */
  startAutoResizer: () => void;
  /** Stops resizing the iframe automatically */
  stopAutoResizer: () => void;
  /** Triggers a change in the size of the iframe. If you don't explicitely pass a `newHeight` it will be automatically calculated using the iframe content at the moment */
  updateHeight: (newHeight?: number) => void;
};

export type { Field, ModelBlock };

export type InitCtx = InitPropertiesAndMethods;
export type FieldInitCtx = InitPropertiesAndMethods & { itemType: ModelBlock };
export type RenderPageCtx = RenderPagePropertiesAndMethods;
export type RenderModalCtx = RenderModalPropertiesAndMethods & SizingUtilities;
export type RenderSidebarPaneCtx = RenderSidebarPanePropertiesAndMethods & SizingUtilities;
export type RenderFieldExtensionCtx = RenderFieldExtensionPropertiesAndMethods & SizingUtilities;
export type RenderManualFieldExtensionParametersFormCtx = RenderManualFieldExtensionParametersFormPropertiesAndMethods &
  SizingUtilities;
export type RenderPluginParametersFormCtx = RenderPluginParametersFormPropertiesAndMethods &
  SizingUtilities;

/** The full options you can pass to the `connect` function */
export type FullConnectParameters = {
  /**
   * Use this function to declare new tabs you want to add in the top-bar of the UI
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   mainNavigationTabs(ctx: InitCtx) {
   *     return [
   *       {
   *         label: 'Analytics',
   *         icon: 'analytics',
   *         placement: ['before', 'content'],
   *         pointsTo: {
   *           pageId: 'analytics',
   *         },
   *       },
   *     ];
   *   },
   * });
   **/
  mainNavigationTabs: (ctx: InitCtx) => MainNavigationTab[];
  /**
   * Use this function to declare new navigation sections in the Settings Area sidebar
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   settingsAreaSidebarItemGroups(ctx: InitCtx) {
   *     return [
   *       {
   *         label: 'Analytics',
   *         items: [
   *           {
   *             label: 'Help',
   *             icon: 'life-ring',
   *             pointsTo: {
   *               pageId: 'help',
   *             },
   *           },
   *         ],
   *       },
   *     ];
   *   },
   * });
   **/
  settingsAreaSidebarItemGroups: (ctx: InitCtx) => SettingsAreaSidebarItemGroup[];
  /**
   * Use this function to declare new navigation items in the Content Area sidebar
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   contentAreaSidebarItems(ctx: InitCtx) {
   *     return [
   *       {
   *         label: 'Welcome!',
   *         icon: 'igloo',
   *         placement: ['before', 'menuItems'],
   *         pointsTo: {
   *           pageId: 'welcome',
   *         },
   *       },
   *     ];
   *   },
   * });
   *
   **/
  contentAreaSidebarItems: (ctx: InitCtx) => ContentAreaSidebarItem[];
  /**
   * Use this function to declare new field extensions that users will be able to install manually in some field
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   manualFieldExtensions(ctx) {
   *     return [
   *       {
   *         id: 'shopify',
   *         name: 'Shopify product finder',
   *         type: 'field_editor',
   *         fieldTypes: ['string'],
   *         configurable: true,
   *       },
   *       {
   *         id: 'lorem',
   *         name: 'Lorem Ipsum generator',
   *         type: 'field_addon',
   *         fieldTypes: ['string'],
   *         configurable: false,
   *       },
   *     ];
   *   },
   * });
   **/
  manualFieldExtensions: (ctx: InitCtx) => FieldExtension[];
  /**
   * Use this function to declare new sidebar panes to be shown when the user edits records of a particular model
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   itemTypeSidebarPanes(model: ModelBlock, ctx: InitCtx) {
   *     return [
   *       {
   *         id: 'preview',
   *         label: 'Preview',
   *         parameters: { foo: 'bar' },
   *       },
   *     ];
   *   },
   * });
   **/
  itemTypeSidebarPanes: (itemType: ModelBlock, ctx: InitCtx) => SidebarPane[];
  /**
   * Use this function to automatically force one or more field extensions to a particular field
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   overrideFieldExtensions(field, { itemType }) {
   *     if (
   *       field.attributes.field_type !== 'string' ||
   *       field.attributes.api_key !== 'title'
   *     ) {
   *       return undefined;
   *     }
   *
   *     return {
   *       editor: {
   *         id: 'titleFieldEditor',
   *         type: 'field_editor',
   *         parameters: { foo: 'bar' },
   *       },
   *       addons: [
   *         {
   *           id: 'titleAddon',
   *           parameters: { foo: 'bar' },
   *         },
   *       ],
   *     };
   *   },
   * });
   **/
  overrideFieldExtensions: (field: Field, ctx: FieldInitCtx) => FieldExtensionOverride | void;
  /**
   * This function will be called each time the configuration object changes. It must return an object containing possible validation errors
   *
   * @example
   * import { connect } from 'datocms-plugins-sdk';
   *
   * connect({
   *   async validateManualFieldExtensionParameters(fieldExtension, parameters) {
   *     const errors: Record<string, string> = {};
   *
   *     if (!parameters.someRequiredParameter) {
   *       errors.someRequiredParameter = 'required';
   *     }
   *
   *     return errors;
   *   },
   * });
   **/
  validateManualFieldExtensionParameters: (
    fieldExtensionId: string,
    parameters: Record<string, unknown>,
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
  /** This function will be called when the plugin needs to render the plugin's configuration form */
  renderPluginParametersForm: (ctx: RenderPluginParametersFormCtx) => void;
  /** This function will be called when the plugin needs to render a specific page (see the `mainNavigationTabs`, `settingsAreaSidebarItemGroups` and `contentAreaSidebarItems` functions) */
  renderPage: (pageId: string, ctx: RenderPageCtx) => void;
  /** This function will be called when the plugin requested to open a modal (see the `openModal` function) */
  renderModal: (modalId: string, ctx: RenderModalCtx) => void;
  /** This function will be called when the plugin needs to render a sidebar panel (see the `itemTypeSidebarPanes` function) */
  renderSidebarPane: (sidebarPaneId: string, ctx: RenderSidebarPaneCtx) => void;
  /** This function will be called when the plugin needs to render a field extension (see the `manualFieldExtensions` and `overrideFieldExtensions` functions) */
  renderFieldExtension: (fieldExtensionId: string, ctx: RenderFieldExtensionCtx) => void;
  /** This function will be called when the plugin needs to render the configuration form for installing a field extension inside a particular field */
  renderManualFieldExtensionParametersForm: (
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionParametersFormCtx,
  ) => void;
};

function toMultifield<Result>(fn: ((field: Field, ctx: FieldInitCtx) => Result) | undefined) {
  return (fields: Field[], ctx: InitPropertiesAndMethods): Record<string, Result> => {
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

const buildRenderUtils = (parent: { setHeight: (number: number) => void }) => {
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

export async function connect(configuration: Partial<FullConnectParameters> = {}): Promise<void> {
  const {
    mainNavigationTabs,
    settingsAreaSidebarItemGroups,
    contentAreaSidebarItems,
    manualFieldExtensions,
    itemTypeSidebarPanes,
  } = configuration;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let listener: ((newSettings: any) => void) | null = null;

  const penpalConnection = connectToParent({
    methods: {
      sdkVersion: () => '0.2.0',
      mainNavigationTabs,
      settingsAreaSidebarItemGroups,
      contentAreaSidebarItems,
      manualFieldExtensions,
      itemTypeSidebarPanes,
      overrideFieldExtensions: toMultifield(configuration.overrideFieldExtensions),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange(newSettings: any) {
        if (listener) {
          listener(newSettings);
        }
      },
      validateManualFieldExtensionParameters: configuration.validateManualFieldExtensionParameters,
    },
  });

  const parent: Parent = await penpalConnection.promise;
  const initialSettings = await parent.getSettings();

  if (isInitParent(parent, initialSettings)) {
    // Nothing to do. Parent calls the method they need.
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

  if (isRenderPluginParametersFormParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderPluginParametersFormMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderPluginParametersForm) {
        return;
      }

      configuration.renderPluginParametersForm({
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

  if (isRenderSidebarPaneParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderSidebarPaneMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderSidebarPane) {
        return;
      }

      configuration.renderSidebarPane(settings.sidebarPaneId, {
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

  if (isRenderManualFieldExtensionParametersFormParent(parent, initialSettings)) {
    type Settings = AsyncReturnType<RenderManualFieldExtensionParametersFormMethods['getSettings']>;

    const renderUtils = buildRenderUtils(parent);

    const render = (settings: Settings) => {
      if (!configuration.renderManualFieldExtensionParametersForm) {
        return;
      }

      configuration.renderManualFieldExtensionParametersForm(settings.fieldExtensionId, {
        ...parent,
        ...settings,
        ...renderUtils,
      });
    };

    listener = render;
    render(initialSettings as Settings);
  }
}
