import { BlockNodeTypeWithCustomStyle } from 'datocms-structured-text-utils';

import {
  Account,
  Field,
  Fieldset,
  Item,
  ModelBlock,
  Plugin,
  Role,
  Site,
  SsoUser,
  Upload,
  User,
} from './SiteApiSchema';

export type Icon = string | { type: 'svg'; viewBox: string; content: string };

/** A tab to be displayed in the top-bar of the UI */
export type MainNavigationTab = {
  /** Label to be shown. Must be unique. */
  label: string;
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /** ID of the page linked to the tab */
  pointsTo: {
    pageId: string;
  };
  /**
   * Expresses where you want to place the tab in the top-bar. If not specified,
   * the tab will be placed after the standard tabs provided by DatoCMS itself.
   */
  placement?: [
    'before' | 'after',
    'content' | 'mediaArea' | 'apiExplorer' | 'settings',
  ];
  /**
   * If different plugins specify the same `placement` for their tabs, they will
   * be displayed by ascending `rank`. If you want to specify an explicit value
   * for `rank`, make sure to offer a way for final users to customize it inside
   * the plugin's settings form, otherwise the hardcoded value you choose might
   * clash with the one of another plugin!
   */
  rank?: number;
};

/** An item contained in a Settings Area group */
export type SettingsAreaSidebarItem = {
  /** Label to be shown. Must be unique. */
  label: string;
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /** ID of the page linked to the item */
  pointsTo: {
    pageId: string;
  };
};

/**
 * The sidebar in the Settings Area presents a number of pages grouped by topic.
 * This object represents a new group to be added in the sideebar to the
 * standard ones DatoCMS provides.
 */
export type SettingsAreaSidebarItemGroup = {
  /** Label to be shown. Must be unique. */
  label: string;
  /** The list of items it contains * */
  items: SettingsAreaSidebarItem[];
  /**
   * Expresses where you want the group to be placed inside the sidebar. If not
   * specified, the item will be placed after the standard items provided by
   * DatoCMS itself.
   */
  placement?: [
    'before' | 'after',
    (
      | 'environment'
      | 'project'
      | 'permissions'
      | 'webhooks'
      | 'deployment'
      | 'sso'
      | 'auditLog'
      | 'usage'
    ),
  ];
  /**
   * If different plugins specify the same `placement` for their sections, they
   * will be displayed by ascending `rank`. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin! *
   */
  rank?: number;
};

/**
 * The sidebar in the Content Area presents a number of user-defined menu-items.
 * This object represents a new item to be added in the sidebar.
 */
export type ContentAreaSidebarItem = {
  /** Label to be shown. Must be unique. */
  label: string;
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /** ID of the page linked to the item */
  pointsTo: {
    pageId: string;
  };
  /**
   * Expresses where you want the item to be placed inside the sidebar. If not
   * specified, the item will be placed after the standard items provided by
   * DatoCMS itself.
   */
  placement?: ['before' | 'after', 'menuItems' | 'settings'];
  /**
   * If different plugins specify the same `placement` for their panels, they
   * will be displayed by ascending `rank`. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin! *
   */
  rank?: number;
};

export type FieldExtensionType = 'editor' | 'addon';

export type FieldType =
  | 'boolean'
  | 'color'
  | 'date_time'
  | 'date'
  | 'file'
  | 'float'
  | 'gallery'
  | 'integer'
  | 'json'
  | 'lat_lon'
  | 'link'
  | 'links'
  | 'rich_text'
  | 'seo'
  | 'slug'
  | 'string'
  | 'structured_text'
  | 'text'
  | 'video';

/**
 * Field extensions extend the basic functionality of DatoCMS when it comes to
 * presenting record's fields to the final user. Depending on the extension type
 * (`editor` or `addon`) they will be shown in different places of the interface.
 */
export type ManualFieldExtension = {
  /**
   * ID of field extension. Will be the first argument for the
   * `renderFieldExtension` function
   */
  id: string;
  /** Name to be shown when editing fields */
  name: string;
  /**
   * Type of field extension. An `editor` extension replaces the default field
   * editor that DatoCMS provides, while an `addon` extension is placed
   * underneath the field editor to provide additional info/behaviour. You can
   * setup multiple field addons for every field.
   */
  type: FieldExtensionType;
  /**
   * For `editor` extensions: moves the field to the sidebar of the record
   * editing page, mimicking a sidebar panel
   */
  asSidebarPanel?: boolean | { startOpen: boolean };
  /**
   * The type of fields that the field extension in compatible with. You can use
   * the shortcut `all` to target all types of fields
   */
  fieldTypes: 'all' | FieldType[];
  /**
   * Whether this field extension needs some configuration options before being
   * installed in a field or not. Will trigger the
   * `renderManualFieldExtensionConfigScreen` and
   * `validateManualFieldExtensionParameters` methods
   */
  configurable?: boolean | { initialHeight: number };
  /** The initial height to set for the iframe that will render the field extension */
  initialHeight?: number;
};

export type ItemFormSidebarPanelPlacement = [
  'before' | 'after',
  'info' | 'actions' | 'links' | 'history',
];

/** A sidebar panel to be shown inside the record's editing page */
export type ItemFormSidebarPanel = {
  /**
   * ID of the panel. Will be the first argument for the
   * `renderItemFormSidebarPanel` function
   */
  id: string;
  /** Label to be shown on the collapsible sidebar panel handle */
  label: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderItemFormSidebarPanel` function
   */
  parameters?: Record<string, unknown>;
  /** Whether the sidebar panel will start open or collapsed */
  startOpen?: boolean;
  /**
   * Expresses where you want the item to be placed inside the sidebar. If not
   * specified, the item will be placed after the standard panels provided by
   * DatoCMS itself.
   */
  placement?: ItemFormSidebarPanelPlacement;
  /**
   * If multiple sidebar panels specify the same `placement`, they will be
   * sorted by ascending `rank`. If you want to specify an explicit value for
   * `rank`, make sure to offer a way for final users to customize it inside the
   * plugin's settings form, otherwise the hardcoded value you choose might
   * clash with the one of another plugin! *
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the sidebar panel */
  initialHeight?: number;
};

/** A field editor/sidebar forced on a field */
export type EditorOverride = {
  /**
   * ID of field extension. Will be the first argument for the
   * `renderFieldExtension` function
   */
  id: string;
  /** Moves the field to the sidebar of the record editing page, mimicking a sidebar panel */
  asSidebarPanel?:
    | boolean
    | { startOpen?: boolean; placement?: ItemFormSidebarPanelPlacement };
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderFieldExtension` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple plugins override a field, the one with the highest `rank` will
   * win. If you want to specify an explicit value for `rank`, make sure to
   * offer a way for final users to customize it inside the plugin's settings
   * form, otherwise the hardcoded value you choose might clash with the one of
   * another plugin! *
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the field extension */
  initialHeight?: number;
};

/** A field addon extension forced on a field */
export type AddonOverride = {
  /**
   * ID of field extension. Will be the first argument for the
   * `renderFieldExtension` function
   */
  id: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderFieldExtension` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple addons are present for a field, they will be sorted by
   * ascending `rank`. If you want to specify an explicit value for `rank`, make
   * sure to offer a way for final users to customize it inside the plugin's
   * settings form, otherwise the hardcoded value you choose might clash with
   * the one of another plugin! *
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the field extension */
  initialHeight?: number;
};

export type StructuredTextCustomMarkPlacement = [
  'before' | 'after',
  'strong' | 'emphasis' | 'underline' | 'code' | 'highlight' | 'strikethrough',
];

/** An object expressing a custom mark for a Structured Text field */
export type StructuredTextCustomMark = {
  /** ID of mark */
  id: string;
  /** Label representing the custom mark */
  label: string;
  toolbarButton: {
    /**
     * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
     * `"address-book"`) or a custom SVG definition. To maintain visual
     * consistency with the rest of the interface, try to use FontAwesome icons
     * whenever possible
     */
    icon: Icon;
    /**
     * Expresses where you want the custom mark button to be placed inside the
     * toolbar. If not specified, the item will be placed after the standard
     * marks provided by DatoCMS itself.
     */
    placement?: StructuredTextCustomMarkPlacement;
    /**
     * If multiple custom marks specify the same `placement` for their toolbar
     * button, they will be sorted by ascending `rank`. If you want to specify
     * an explicit value for `rank`, make sure to offer a way for final users to
     * customize it inside the plugin's settings form, otherwise the hardcoded
     * value you choose might clash with the one of another plugin!
     */
    rank?: number;
  };
  /**
   * Keyboard shortcut associated with the custom mark, expressed using the
   * https://github.com/ianstormtaylor/is-hotkey syntax (ie. `mod+shift+x`)
   */
  keyboardShortcut?: string;
  /** How the custom mark will be styled inside the editor */
  appliedStyle: React.CSSProperties;
};

/** An object expressing a custom block style for a Structured Text field */
export type StructuredTextCustomBlockStyle = {
  /** ID of custom block style */
  id: string;
  /** The block node that can apply this style */
  node: BlockNodeTypeWithCustomStyle;
  /** ID of custom block style */
  label: string;
  /** How the block will be styled inside the editor to represent the style */
  appliedStyle: React.CSSProperties;
  /**
   * Custom styles for a block node will be sorted by ascending `rank`. If you
   * want to specify an explicit value for `rank`, make sure to offer a way for
   * final users to customize it inside the plugin's settings form, otherwise
   * the hardcoded value you choose might clash with the one of another plugin!
   */
  rank?: number;
};

/** An object expressing some field extensions you want to force on a particular field */
export type FieldExtensionOverride = {
  /** Force a field editor/sidebar extension on a field */
  editor?: EditorOverride;
  /** One or more field sidebar extensions to forcefully add to a field */
  addons?: AddonOverride[];
};

/** An object containing the theme colors for the current DatoCMS project */
export type Theme = {
  primaryColor: string;
  accentColor: string;
  semiTransparentAccentColor: string;
  lightColor: string;
  darkColor: string;
};

/** Focal point of an image asset */
export type FocalPoint = {
  /** Horizontal position expressed as float between 0 and 1 */
  x: number;
  /** Vertical position expressed as float between 0 and 1 */
  y: number;
};

/** The structure contained in a "single asset" field */
export type FileFieldValue = {
  /** ID of the asset */
  // eslint-disable-next-line camelcase
  upload_id: string;
  /** Alternate text for the asset */
  alt: string | null;
  /** Title for the asset */
  title: string | null;
  /** Focal point of an asset */
  // eslint-disable-next-line camelcase
  focal_point: FocalPoint | null;
  /** Object with arbitrary metadata related to the asset */
  // eslint-disable-next-line camelcase
  custom_data: Record<string, string>;
};

/** A modal to present to the user */
export type Modal = {
  /** ID of the modal. Will be the first argument for the `renderModal` function */
  id: string;
  /** Title for the modal. Ignored by `fullWidth` modals */
  title?: string;
  /** Whether to present a close button for the modal or not */
  closeDisabled?: boolean;
  /** Width of the modal. Can be a number, or one of the predefined sizes */
  width?: 's' | 'm' | 'l' | 'xl' | 'fullWidth' | number;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderModal` function
   */
  parameters?: Record<string, unknown>;
  /** The initial height to set for the iframe that will render the modal content */
  initialHeight?: number;
};

/** An additional asset source */
export type AssetSource = {
  /**
   * ID of the asset source. Will be the first argument for the
   * `renderAssetSource` function
   */
  id: string;
  /** Name of the asset that will be shown to the user */
  name: string;
  /**
   * Icon to be shown alongside the name. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /**
   * Configuration options for the modal that will be opened to select a media
   * file from this source
   */
  modal?: {
    /** Width of the modal. Can be a number, or one of the predefined sizes */
    width?: 's' | 'm' | 'l' | 'xl' | number;
    /** The initial height to set for the iframe that will render the modal content */
    initialHeight?: number;
  };
};

/** A toast notification to present to the user */
export type Toast<CtaValue = unknown> = {
  /** Message of the notification */
  message: string;
  /** Type of notification. Will present the toast in a different color accent. */
  type: 'notice' | 'alert' | 'warning';
  /** An optional button to show inside the toast */
  cta?: {
    /** Label for the button */
    label: string;
    /**
     * The value to be returned by the `customToast` promise if the button is
     * clicked by the user
     */
    value: CtaValue;
  };
  /** Whether the toast is to be automatically closed if the user changes page */
  dismissOnPageChange?: boolean;
  /**
   * Whether the toast is to be automatically closed after some time (`true`
   * will use the default DatoCMS time interval)
   */
  dismissAfterTimeout?: boolean | number;
};

/** A choice presented in a `openConfirm` panel */
export type ConfirmChoice = {
  /** The label to be shown for the choice */
  label: string;
  /**
   * The value to be returned by the `openConfirm` promise if the button is
   * clicked by the user
   */
  value: unknown;
  /** The intent of the button. Will present the button in a different color accent. */
  intent?: 'positive' | 'negative';
};

/** Options for the `openConfirm` function */
export type ConfirmOptions = {
  /** The title to be shown inside the confirmation panel */
  title: string;
  /** The main message to be shown inside the confirmation panel */
  content: string;
  /** The different options the user can choose from */
  choices: ConfirmChoice[];
  /** The cancel option to present to the user */
  cancel: ConfirmChoice;
};

/** Generic properties available in all the hooks */
export type CommonProperties = {
  /** The current DatoCMS project */
  site: Site;
  /** The ID of the current environment */
  environment: string;
  /** All the models of the current DatoCMS project, indexed by ID */
  itemTypes: Partial<Record<string, ModelBlock>>;
  /**
   * The current DatoCMS user. It can either be the owner or one of the
   * collaborators (regular or SSO).
   */
  currentUser: User | SsoUser | Account;
  /** The role for the current DatoCMS user */
  currentRole: Role;
  /**
   * The access token to perform API calls on behalf of the current user. Only
   * available if `currentUserAccessToken` additional permission is granted
   */
  currentUserAccessToken: string | undefined;
  /** The current plugin */
  plugin: Plugin;
  /**
   * UI preferences of the current user (right now, only the preferred locale is
   * available)
   */
  ui: {
    /** Preferred locale */
    locale: string;
  };
};

export type InitAdditionalProperties = {
  mode: 'init';
};

export type InitProperties = CommonProperties & InitAdditionalProperties;

export type InitMethods = {
  getSettings: () => Promise<InitProperties>;
};

export type InitPropertiesAndMethods = InitMethods & InitProperties;

/** Additional properties available in all `renderXXX` hooks */
export type RenderAdditionalProperties = {
  /**
   * All the fields currently loaded for the current DatoCMS project, indexed by
   * ID. It will always contain the current model fields and all the fields of
   * the blocks it might contain via Modular Content/Structured Text fields. If
   * some fields you need are not present, use the `loadItemTypeFields` function
   * to load them.
   */
  fields: Partial<Record<string, Field>>;
  /**
   * All the fieldsets currently loaded for the current DatoCMS project, indexed
   * by ID. It will always contain the current model fields and all the fields
   * of the blocks it might contain via Modular Content/Structured Text fields.
   * If some fields you need are not present, use the `loadItemTypeFieldsets`
   * function to load them.
   */
  fieldsets: Partial<Record<string, Fieldset>>;
  /** An object containing the theme colors for the current DatoCMS project */
  theme: Theme;
  /**
   * All the regular users currently loaded for the current DatoCMS project,
   * indexed by ID. It will always contain the current user. If some users you
   * need are not present, use the `loadUsers` function to load them.
   */
  users: Partial<Record<string, User>>;
  /**
   * All the SSO users currently loaded for the current DatoCMS project, indexed
   * by ID. It will always contain the current user. If some users you need are
   * not present, use the `loadSsoUsers` function to load them.
   */
  ssoUsers: Partial<Record<string, SsoUser>>;
  /** The project owner */
  account: Account;
  /** The padding in px that must be applied to the body */
  bodyPadding: [number, number, number, number];
};

export type RenderProperties = CommonProperties & RenderAdditionalProperties;

export type FieldAppearanceChange =
  | {
      operation: 'removeEditor';
    }
  | {
      operation: 'updateEditor';
      newFieldExtensionId?: string;
      newParameters?: Record<string, unknown>;
    }
  | {
      operation: 'setEditor';
      fieldExtensionId: string;
      parameters: Record<string, unknown>;
    }
  | {
      operation: 'removeAddon';
      index: number;
    }
  | {
      operation: 'updateAddon';
      index: number;
      newFieldExtensionId?: string;
      newParameters?: Record<string, unknown>;
    }
  | {
      operation: 'insertAddon';
      index: number;
      fieldExtensionId: string;
      parameters: Record<string, unknown>;
    };

/**
 * These methods can be used to update both plugin parameters and manual field
 * extensions configuration.
 */
export type UpdateParametersMethods = {
  /**
   * Updates the plugin parameters.
   *
   * Always check `ctx.currentRole.meta.final_permissions.can_edit_schema`
   * before calling this, as the user might not have the permission to perform
   * the operation.
   *
   * @example
   *
   * ```js
   * await ctx.updatePluginParameters({ debugMode: true });
   * await ctx.notice('Plugin parameters successfully updated!');
   * ```
   */
  updatePluginParameters: (params: Record<string, unknown>) => Promise<void>;
  /**
   * Performs changes in the appearance of a field. You can install/remove a
   * manual field extension, or tweak their parameters. If multiple changes are
   * passed, they will be applied sequencially.
   *
   * Always check `ctx.currentRole.meta.final_permissions.can_edit_schema`
   * before calling this, as the user might not have the permission to perform
   * the operation.
   *
   * @example
   *
   * ```js
   * const fields = await ctx.loadFieldsUsingPlugin();
   *
   * if (fields.length === 0) {
   *   ctx.alert('No field is using this plugin as a manual extension!');
   *   return;
   * }
   *
   * for (const field of fields) {
   *   const { appearance } = field.attributes;
   *   const operations = [];
   *
   *   if (appearance.editor === ctx.plugin.id) {
   *     operations.push({
   *       operation: 'updateEditor',
   *       newParameters: {
   *         ...appearance.parameters,
   *         foo: 'bar',
   *       },
   *     });
   *   }
   *
   *   appearance.addons.forEach((addon, i) => {
   *     if (addon.id !== ctx.plugin.id) {
   *       return;
   *     }
   *
   *     operations.push({
   *       operation: 'updateAddon',
   *       index: i,
   *       newParameters: { ...addon.parameters, foo: 'bar' },
   *     });
   *   });
   *
   *   await ctx.updateFieldAppearance(field.id, operations);
   *   ctx.notice(`Successfully edited field ${field.attributes.api_key}`);
   * }
   * ```
   */
  updateFieldAppearance: (
    fieldId: string,
    changes: FieldAppearanceChange[],
  ) => Promise<void>;
};

/**
 * These methods can be used to asyncronously load additional information your
 * plugin needs to work
 */
export type LoadDataMethods = {
  /**
   * Loads all the fields for a specific model (or block). Fields will be
   * returned and will also be available in the the `fields` property.
   *
   * @example
   *
   * ```js
   * const itemTypeId = prompt('Please insert a model ID:');
   *
   * const fields = await ctx.loadItemTypeFields(itemTypeId);
   *
   * ctx.notice(
   *   `Success! ${fields
   *     .map((field) => field.attributes.api_key)
   *     .join(', ')}`,
   * );
   * ```
   */
  loadItemTypeFields: (itemTypeId: string) => Promise<Field[]>;
  /**
   * Loads all the fieldsets for a specific model (or block). Fieldsets will be
   * returned and will also be available in the the `fieldsets` property.
   *
   * @example
   *
   * ```js
   * const itemTypeId = prompt('Please insert a model ID:');
   *
   * const fieldsets = await ctx.loadItemTypeFieldsets(itemTypeId);
   *
   * ctx.notice(
   *   `Success! ${fieldsets
   *     .map((fieldset) => fieldset.attributes.title)
   *     .join(', ')}`,
   * );
   * ```
   */
  loadItemTypeFieldsets: (itemTypeId: string) => Promise<Fieldset[]>;
  /**
   * Loads all the fields in the project that are currently using the plugin for
   * one of its manual field extensions.
   *
   * @example
   *
   * ```js
   * const fields = await ctx.loadFieldsUsingPlugin();
   *
   * ctx.notice(
   *   `Success! ${fields
   *     .map((field) => field.attributes.api_key)
   *     .join(', ')}`,
   * );
   * ```
   */
  loadFieldsUsingPlugin: () => Promise<Field[]>;
  /**
   * Loads all regular users. Users will be returned and will also be available
   * in the the `users` property.
   *
   * @example
   *
   * ```js
   * const users = await ctx.loadUsers();
   *
   * ctx.notice(`Success! ${users.map((user) => user.id).join(', ')}`);
   * ```
   */
  loadUsers: () => Promise<User[]>;
  /**
   * Loads all SSO users. Users will be returned and will also be available in
   * the the `ssoUsers` property.
   *
   * @example
   *
   * ```js
   * const users = await ctx.loadSsoUsers();
   *
   * ctx.notice(`Success! ${users.map((user) => user.id).join(', ')}`);
   * ```
   */
  loadSsoUsers: () => Promise<SsoUser[]>;
};

/** These methods let you open the standard DatoCMS dialogs needed to interact with records */
export type ItemDialogMethods = {
  /**
   * Opens a dialog for creating a new record. It returns a promise resolved
   * with the newly created record or `null` if the user closes the dialog
   * without creating anything.
   *
   * @example
   *
   * ```js
   * const itemTypeId = prompt('Please insert a model ID:');
   *
   * const item = await ctx.createNewItem(itemTypeId);
   *
   * if (item) {
   *   ctx.notice(`Success! ${item.id}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  createNewItem: (itemTypeId: string) => Promise<Item | null>;
  /**
   * Opens a dialog for selecting one (or multiple) record(s) from a list of
   * existing records of type `itemTypeId`. It returns a promise resolved with
   * the selected record(s), or `null` if the user closes the dialog without
   * choosing any record.
   *
   * @example
   *
   * ```js
   * const itemTypeId = prompt('Please insert a model ID:');
   *
   * const items = await ctx.selectItem(itemTypeId, { multiple: true });
   *
   * if (items) {
   *   ctx.notice(`Success! ${items.map((i) => i.id).join(', ')}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  selectItem: {
    (itemTypeId: string, options: { multiple: true }): Promise<Item[] | null>;
    (itemTypeId: string, options?: { multiple: false }): Promise<Item | null>;
  };
  /**
   * Opens a dialog for editing an existing record. It returns a promise
   * resolved with the edited record, or `null` if the user closes the dialog
   * without persisting any change.
   *
   * @example
   *
   * ```js
   * const itemId = prompt('Please insert a record ID:');
   *
   * const item = await ctx.editItem(itemId);
   *
   * if (item) {
   *   ctx.notice(`Success! ${item.id}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  editItem: (itemId: string) => Promise<Item | null>;
};

/** These methods can be used to show UI-consistent toast notifications to the end-user */
export type ToastMethods = {
  /**
   * Triggers an "error" toast displaying the selected message
   *
   * @example
   *
   * ```js
   * const message = prompt(
   *   'Please insert a message:',
   *   'This is an alert message!',
   * );
   *
   * await ctx.alert(message);
   * ```
   */
  alert: (message: string) => Promise<void>;
  /**
   * Triggers a "success" toast displaying the selected message
   *
   * @example
   *
   * ```js
   * const message = prompt(
   *   'Please insert a message:',
   *   'This is a notice message!',
   * );
   *
   * await ctx.notice(message);
   * ```
   */
  notice: (message: string) => Promise<void>;
  /**
   * Triggers a custom toast displaying the selected message (and optionally a CTA)
   *
   * @example
   *
   * ```js
   * const result = await ctx.customToast({
   *   type: 'warning',
   *   message: 'Just a sample warning notification!',
   *   dismissOnPageChange: true,
   *   dismissAfterTimeout: 5000,
   *   cta: {
   *     label: 'Execute call-to-action',
   *     value: 'cta',
   *   },
   * });
   *
   * if (result === 'cta') {
   *   ctx.notice(`Clicked CTA!`);
   * }
   * ```
   */
  customToast: <CtaValue = unknown>(
    toast: Toast<CtaValue>,
  ) => Promise<CtaValue | null>;
};

/**
 * These methods let you open the standard DatoCMS dialogs needed to interact
 * with Media Area assets
 */
export type UploadDialogMethods = {
  /**
   * Opens a dialog for selecting one (or multiple) existing asset(s). It
   * returns a promise resolved with the selected asset(s), or `null` if the
   * user closes the dialog without selecting any upload.
   *
   * @example
   *
   * ```js
   * const item = await ctx.selectUpload({ multiple: false });
   *
   * if (item) {
   *   ctx.notice(`Success! ${item.id}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  selectUpload: {
    (options: { multiple: true }): Promise<Upload[] | null>;
    (options?: { multiple: false }): Promise<Upload | null>;
  };

  /**
   * Opens a dialog for editing a Media Area asset. It returns a promise resolved with:
   *
   * - The updated asset, if the user persists some changes to the asset itself
   * - `null`, if the user closes the dialog without persisting any change
   * - An asset structure with an additional `deleted` property set to true, if
   *   the user deletes the asset
   *
   * @example
   *
   * ```js
   * const uploadId = prompt('Please insert an asset ID:');
   *
   * const item = await ctx.editUpload(uploadId);
   *
   * if (item) {
   *   ctx.notice(`Success! ${item.id}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  editUpload: (
    uploadId: string,
  ) => Promise<(Upload & { deleted?: true }) | null>;
  /**
   * Opens a dialog for editing a "single asset" field structure. It returns a
   * promise resolved with the updated structure, or `null` if the user closes
   * the dialog without persisting any change.
   *
   * @example
   *
   * ```js
   * const uploadId = prompt('Please insert an asset ID:');
   *
   * const result = await ctx.editUploadMetadata({
   *   upload_id: uploadId,
   *   alt: null,
   *   title: null,
   *   custom_data: {},
   *   focal_point: null,
   * });
   *
   * if (result) {
   *   ctx.notice(`Success! ${JSON.stringify(result)}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  editUploadMetadata: (
    /** The "single asset" field structure */
    fileFieldValue: FileFieldValue,
    /** Shows metadata information for a specific locale */
    locale?: string,
  ) => Promise<FileFieldValue | null>;
};

/** These methods can be used to open custom dialogs/confirmation panels */
export type CustomDialogMethods = {
  /**
   * Opens a custom modal. Returns a promise resolved with what the modal itself
   * returns calling the `resolve()` function
   *
   * @example
   *
   * ```js
   * const result = await ctx.openModal({
   *   id: 'regular',
   *   title: 'Custom title!',
   *   width: 'l',
   *   parameters: { foo: 'bar' },
   * });
   *
   * if (result) {
   *   ctx.notice(`Success! ${JSON.stringify(result)}`);
   * } else {
   *   ctx.alert('Closed!');
   * }
   * ```
   */
  openModal: (modal: Modal) => Promise<unknown>;
  /**
   * Opens a UI-consistent confirmation dialog. Returns a promise resolved with
   * the value of the choice made by the user
   *
   * @example
   *
   * ```js
   * const result = await ctx.openConfirm({
   *   title: 'Custom title',
   *   content:
   *     'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
   *   choices: [
   *     {
   *       label: 'Positive',
   *       value: 'positive',
   *       intent: 'positive',
   *     },
   *     {
   *       label: 'Negative',
   *       value: 'negative',
   *       intent: 'negative',
   *     },
   *   ],
   *   cancel: {
   *     label: 'Cancel',
   *     value: false,
   *   },
   * });
   *
   * if (result) {
   *   ctx.notice(`Success! ${result}`);
   * } else {
   *   ctx.alert('Cancelled!');
   * }
   * ```
   */
  openConfirm: (options: ConfirmOptions) => Promise<unknown>;
};

/** These methods can be used to take the user to different pages */
export type NavigateMethods = {
  /**
   * Moves the user to another URL internal to the backend
   *
   * @example
   *
   * ```js
   * await ctx.navigateTo('/');
   * ```
   */
  navigateTo: (path: string) => Promise<void>;
};

/** These methods can be used to set various properties of the containing iframe */
export type IframeMethods = {
  /** Sets the height for the iframe */
  setHeight: (number: number) => Promise<void>;
};

export type RenderMethods = LoadDataMethods &
  UpdateParametersMethods &
  ToastMethods &
  ItemDialogMethods &
  UploadDialogMethods &
  CustomDialogMethods &
  NavigateMethods;

/**
 * These information describe the current state of the form that's being shown
 * to the end-user to edit a record
 */
export type ItemFormAdditionalProperties = {
  /** The currently active locale for the record */
  locale: string;
  /** If an already persisted record is being edited, returns the full record entity */
  item: Item | null;
  /** The model for the record being edited */
  itemType: ModelBlock;
  /** The complete internal form state */
  formValues: Record<string, unknown>;
  /** The current status of the record being edited */
  itemStatus: 'new' | 'draft' | 'updated' | 'published';
  /** Whether the form is currently submitting itself or not */
  isSubmitting: boolean;
  /** Whether the form has some non-persisted changes or not */
  isFormDirty: boolean;
};

export type ItemFormProperties = RenderProperties &
  ItemFormAdditionalProperties;

/**
 * These methods can be used to interact with the form that's being shown to the
 * end-user to edit a record
 */
export type ItemFormAdditionalMethods = {
  /**
   * Hides/shows a specific field in the form
   *
   * @example
   *
   * ```js
   * const fieldPath = prompt(
   *   'Please insert the path of a field in the form',
   *   ctx.fieldPath,
   * );
   *
   * await ctx.toggleField(fieldPath, true);
   * ```
   */
  toggleField: (path: string, show: boolean) => Promise<void>;
  /**
   * Disables/re-enables a specific field in the form
   *
   * @example
   *
   * ```js
   * const fieldPath = prompt(
   *   'Please insert the path of a field in the form',
   *   ctx.fieldPath,
   * );
   *
   * await ctx.disableField(fieldPath, true);
   * ```
   */
  disableField: (path: string, disable: boolean) => Promise<void>;
  /**
   * Smoothly navigates to a specific field in the form. If the field is
   * localized it will switch language tab and then navigate to the chosen field.
   *
   * @example
   *
   * ```js
   * const fieldPath = prompt(
   *   'Please insert the path of a field in the form',
   *   ctx.fieldPath,
   * );
   *
   * await ctx.scrollToField(fieldPath);
   * ```
   */
  scrollToField: (path: string, locale?: string) => Promise<void>;
  /**
   * Changes a specific path of the `formValues` object
   *
   * @example
   *
   * ```js
   * const fieldPath = prompt(
   *   'Please insert the path of a field in the form',
   *   ctx.fieldPath,
   * );
   *
   * await ctx.setFieldValue(fieldPath, 'new value');
   * ```
   */
  setFieldValue: (path: string, value: unknown) => Promise<void>;
  /**
   * Triggers a submit form for current record
   *
   * @example
   *
   * ```js
   * await ctx.saveCurrentItem();
   * ```
   */
  saveCurrentItem: () => Promise<void>;
};

export type ItemFormMethods = RenderMethods &
  IframeMethods &
  ItemFormAdditionalMethods;

/** Information regarding the specific sidebar panel that you need to render */
export type RenderSidebarPanelAdditionalProperties = {
  mode: 'renderItemFormSidebarPanel';
  /** The ID of the sidebar panel that needs to be rendered */
  sidebarPaneId: string;
  /**
   * The arbitrary `parameters` of the panel declared in the
   * `itemFormSidebarPanels` function
   */
  parameters: Record<string, unknown>;
};

export type RenderSidebarPanelProperties = ItemFormProperties &
  RenderSidebarPanelAdditionalProperties;

export type RenderSidebarPanelAdditionalMethods = {
  getSettings: () => Promise<RenderSidebarPanelProperties>;
};

export type RenderSidebarPanelMethods = ItemFormMethods &
  RenderSidebarPanelAdditionalMethods;

export type RenderSidebarPanePropertiesAndMethods = RenderSidebarPanelMethods &
  RenderSidebarPanelProperties;

/**
 * Information regarding the state of a specific field where you need to render
 * the field extension
 */
export type RenderFieldExtensionAdditionalProperties = {
  mode: 'renderFieldExtension';
  /** The ID of the field extension that needs to be rendered */
  fieldExtensionId: string;
  /** The arbitrary `parameters` of the field extension */
  parameters: Record<string, unknown>;
  /** The placeholder for the field */
  placeholder: string;
  /** Whether the field is currently disabled or not */
  disabled: boolean;
  /** The path in the `formValues` object where to find the current value for the field */
  fieldPath: string;
  /** The field where the field extension is installed to */
  field: Field;
  /**
   * If the field extension is installed in a field of a block, returns the top
   * level Modular Content/Structured Text field containing the block itself
   */
  parentField: Field | undefined;
};

export type RenderFieldExtensionProperties = ItemFormProperties &
  RenderFieldExtensionAdditionalProperties;

export type RenderFieldExtensionAdditionalMethods = {
  getSettings: () => Promise<RenderFieldExtensionProperties>;
};

export type RenderFieldExtensionMethods = ItemFormMethods &
  RenderFieldExtensionAdditionalMethods;

export type RenderFieldExtensionPropertiesAndMethods = RenderFieldExtensionMethods &
  RenderFieldExtensionProperties;

/** Information regarding the specific custom modal that you need to render */
export type RenderModalAdditionalProperties = {
  mode: 'renderModal';
  /** The ID of the modal that needs to be rendered */
  modalId: string;
  /** The arbitrary `parameters` of the modal declared in the `openModal` function */
  parameters: Record<string, unknown>;
};

export type RenderModalProperties = RenderProperties &
  RenderModalAdditionalProperties;

/** These methods can be used to close the modal */
export type RenderModalAdditionalMethods = {
  getSettings: () => Promise<RenderModalProperties>;
  /**
   * A function to be called by the plugin to close the modal. The `openModal`
   * call will be resolved with the passed return value
   *
   * @example
   *
   * ```js
   * const returnValue = prompt(
   *   'Please specify the value to return to the caller:',
   *   'success',
   * );
   *
   * await ctx.resolve(returnValue);
   * ```
   */
  resolve: (returnValue: unknown) => Promise<void>;
};

export type RenderModalMethods = RenderMethods &
  IframeMethods &
  RenderModalAdditionalMethods;

export type RenderModalPropertiesAndMethods = RenderModalMethods &
  RenderModalProperties;

/** Information regarding the specific asset source browser that you need to render */
export type RenderAssetSourceAdditionalProperties = {
  mode: 'renderAssetSource';
  /** The ID of the assetSource that needs to be rendered */
  assetSourceId: string;
};

export type RenderAssetSourceProperties = RenderProperties &
  RenderAssetSourceAdditionalProperties;

export type NewUploadResourceAsUrl = {
  /**
   * URL for the resource. The URL must respond with a
   * `Access-Control-Allow-Origin` header — for instance `*`, which will allow
   * all hosts — allowing the image to be read by DatoCMS
   */
  url: string;
  /**
   * Optional filename to be used to generate the final DatoCMS URL. If not
   * passed, the URL will be used
   */
  filename?: string;
};

export type NewUploadResourceAsBase64 = {
  /**
   * Base64 encoded data URI for the resource.
   *
   * Format:
   *
   * `data:[<mime type>][;charset=<charset>];base64,<encoded data>`
   */
  base64: string;
  /** Filename to be used to generate the final DatoCMS URL */
  filename: string;
};

export type NewUpload = {
  /** The actual resource that will be uploaded */
  resource: NewUploadResourceAsUrl | NewUploadResourceAsBase64;
  /** Copyright to apply to the asset */
  copyright?: string;
  /** Author to apply to the asset */
  author?: string;
  /** Notes to apply to the asset */
  notes?: string;
  /** Tags to apply to the asset */
  tags?: string[];
  /**
   * An hash containing, for each locale of the project, the default metadata to
   * apply to the asset
   */
  default_field_metadata?: {
    [k: string]: {
      /** Alternate text for the asset */
      alt: string | null;
      /** Title for the asset */
      title: string | null;
      /** Object with arbitrary metadata */
      custom_data: {
        [k: string]: unknown;
      };
      /** Focal point (only for image assets) */
      focal_point?: {
        /** Horizontal position expressed as float between 0 and 1 */
        x: number;
        /** Vertical position expressed as float between 0 and 1 */
        y: number;
      } | null;
    };
  };
};

/** Use these methods to confirm */
export type RenderAssetSourceAdditionalMethods = {
  getSettings: () => Promise<RenderAssetSourceProperties>;
  /**
   * Function to be called when the user selects the asset: it will trigger the
   * creation of a new `Upload` that will be added in the Media Area.
   *
   * @example
   *
   * ```js
   * await ctx.select({
   *   resource: {
   *     url:
   *       'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f',
   *     filename: 'man-drinking-coffee.jpg',
   *   },
   *   copyright: 'Royalty free (Unsplash)',
   *   author: 'Jeff Sheldon',
   *   notes: 'A man drinking a coffee',
   *   tags: ['man', 'coffee'],
   * });
   * ```
   */
  select: (newUpload: NewUpload) => void;
};

export type RenderAssetSourceMethods = RenderMethods &
  IframeMethods &
  RenderAssetSourceAdditionalMethods;

export type RenderAssetSourcePropertiesAndMethods = RenderAssetSourceMethods &
  RenderAssetSourceProperties;

/** Information regarding the specific page that you need to render */
export type RenderPageAdditionalProperties = {
  mode: 'renderPage';
  /** The ID of the page that needs to be rendered */
  pageId: string;
};

export type RenderPageProperties = RenderProperties &
  RenderPageAdditionalProperties;

export type RenderPageAdditionalMethods = {
  getSettings: () => Promise<RenderPageProperties>;
};

export type RenderPageMethods = RenderMethods & RenderPageAdditionalMethods;

export type RenderPagePropertiesAndMethods = RenderPageMethods &
  RenderPageProperties;

export type PendingField = {
  id?: string;
  type: 'field';
  attributes: {
    api_key: Field['attributes']['api_key'];
    appearance: Field['attributes']['appearance'];
    default_value: Field['attributes']['default_value'];
    field_type: Field['attributes']['field_type'];
    hint: Field['attributes']['hint'];
    label: Field['attributes']['label'];
    localized: Field['attributes']['localized'];
    validators: Field['attributes']['validators'];
  };
};

/**
 * Information regarding the specific form that you need to render to let the
 * end-user edit the configuration object of a field extension
 */
export type RenderManualFieldExtensionConfigScreenAdditionalProperties = {
  mode: 'renderManualFieldExtensionConfigScreen';
  /** The ID of the field extension for which we need to render the parameters form */
  fieldExtensionId: string;
  /**
   * The current value of the parameters (you can change the value with the
   * `setParameters` function)
   */
  parameters: Record<string, unknown>;
  /**
   * The current validation errors for the parameters (you can set them
   * implementing the `validateManualFieldExtensionParameters` function)
   */
  errors: Record<string, unknown>;

  /** The field entity that is being edited in the form */
  pendingField: PendingField;

  /** The model for the field being edited */
  itemType: ModelBlock;
};

export type RenderManualFieldExtensionConfigScreenProperties = RenderProperties &
  RenderManualFieldExtensionConfigScreenAdditionalProperties;

/**
 * These methods can be used to update the configuration object of a specific
 * field extension
 */
export type RenderManualFieldExtensionConfigScreenAdditionalMethods = {
  getSettings: () => Promise<RenderManualFieldExtensionConfigScreenProperties>;
  /**
   * Sets a new value for the parameters
   *
   * @example
   *
   * ```js
   * await ctx.setParameters({ color: '#ff0000' });
   * ```
   */
  setParameters: (params: Record<string, unknown>) => Promise<void>;
};

export type RenderManualFieldExtensionConfigScreenMethods = RenderMethods &
  IframeMethods &
  RenderManualFieldExtensionConfigScreenAdditionalMethods;

export type RenderManualFieldExtensionConfigScreenPropertiesAndMethods = RenderManualFieldExtensionConfigScreenMethods &
  RenderManualFieldExtensionConfigScreenProperties;

export type RenderConfigScreenAdditionalProperties = {
  mode: 'renderConfigScreen';
};

export type RenderConfigScreenProperties = RenderProperties &
  RenderConfigScreenAdditionalProperties;

/** These methods can be used to update the configuration object of your plugin */
export type RenderConfigScreenAdditionalMethods = {
  getSettings: () => Promise<RenderConfigScreenProperties>;
};

export type RenderConfigScreenMethods = RenderMethods &
  IframeMethods &
  RenderConfigScreenAdditionalMethods;

export type RenderConfigScreenPropertiesAndMethods = RenderConfigScreenMethods &
  RenderConfigScreenProperties;

export type OnBootAdditionalProperties = {
  mode: 'onBoot';
};

export type OnBootProperties = RenderProperties & OnBootAdditionalProperties;

export type OnBootAdditionalMethods = {
  getSettings: () => Promise<OnBootProperties>;
};

export type OnBootMethods = RenderMethods & OnBootAdditionalMethods;

export type OnBootPropertiesAndMethods = OnBootMethods & OnBootProperties;
