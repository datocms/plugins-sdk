import type { SchemaTypes } from '@datocms/cma-client';
import type { BlockNodeTypeWithCustomStyle } from 'datocms-structured-text-utils';

type Account = SchemaTypes.Account;
type Organization = SchemaTypes.Organization;
type Field = SchemaTypes.Field;
type Fieldset = SchemaTypes.Fieldset;
type Item = SchemaTypes.Item;
type ItemType = SchemaTypes.ItemType;
type Plugin = SchemaTypes.Plugin;
type Role = SchemaTypes.Role;
type Site = SchemaTypes.Site;
type SsoUser = SchemaTypes.SsoUser;
type Upload = SchemaTypes.Upload;
type User = SchemaTypes.User;

export type Icon =
  | AwesomeFontIconIdentifier
  | { type: 'svg'; viewBox: string; content: string };

export type ItemListLocationQuery = {
  locale?: string;
  filter?: {
    query?: string;
    fields?: Record<string, unknown>;
  };
};

export type ItemPresentationInfo = {
  /** The title to present the record */
  title: string;
  /** An image representative of the record */
  imageUrl?: string;
  /**
   * If different plugins implement the `buildItemPresentationInfo` hook, the
   * one with the lowest `rank` will be used. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin!
   */
  rank?: number;
};

export type InitialLocationQueryForItemSelector = {
  locationQuery: ItemListLocationQuery;
  /**
   * If different plugins implement the `initialLocationQueryForItemSelector`
   * hook, the one with the lowest `rank` will be used. If you want to specify
   * an explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
};

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
    'content' | 'media' | 'schema' | 'configuration' | 'cdaPlayground',
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
  placement?: ['before' | 'after', 'properties' | 'permissions'];
  /**
   * If different plugins specify the same `placement` for their sections, they
   * will be displayed by ascending `rank`. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin!
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
  placement?: ['before' | 'after', 'menuItems' | 'seoPreferences'];
  /**
   * If different plugins specify the same `placement` for their panels, they
   * will be displayed by ascending `rank`. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin!
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
 * (`editor` or `addon`) they will be shown in different places of the
 * interface.
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
  /**
   * The initial height to set for the iframe that will render the field
   * extension
   */
  initialHeight?: number;
};

export type ItemFormSidebarPanelPlacement = [
  'before' | 'after',
  'info' | 'publishedVersion' | 'schedule' | 'links' | 'history',
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
   * property of the second argument of the `renderItemFormSidebarPanel`
   * function
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
   * clash with the one of another plugin!
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the sidebar panel */
  initialHeight?: number;
};

/** A sidebar to be shown inside the record's editing page */
export type ItemFormSidebar = {
  /**
   * ID of the sidebar. Will be the first argument for the
   * `renderItemFormSidebar` function
   */
  id: string;
  /** Label to be shown on the collapsible sidebar handle */
  label: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderItemFormSidebar` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple sidebars specify the same `placement`, they will be sorted by
   * ascending `rank`. If you want to specify an explicit value for `rank`, make
   * sure to offer a way for final users to customize it inside the plugin's
   * settings form, otherwise the hardcoded value you choose might clash with
   * the one of another plugin!
   */
  rank?: number;
  /** The preferred width for the sidebar */
  preferredWidth?: number;
};

/** An outlet to be shown at the top of a record's editing page */
export type ItemFormOutlet = {
  /**
   * ID of the outlet. Will be the first argument for the `renderItemFormOutlet`
   * function
   */
  id: string;
  /**
   * Multiple outlets will be sorted by ascending `rank`. If you want to specify
   * an explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the outlet */
  initialHeight?: number;
};

/** A field editor/sidebar forced on a field */
export type EditorOverride = {
  /**
   * ID of field extension. Will be the first argument for the
   * `renderFieldExtension` function
   */
  id: string;
  /**
   * Moves the field to the sidebar of the record editing page, mimicking a
   * sidebar panel
   */
  asSidebarPanel?:
    | boolean
    | { startOpen?: boolean; placement?: ItemFormSidebarPanelPlacement };
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderFieldExtension` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple plugins override a field, the one with the lowest `rank` will
   * win. If you want to specify an explicit value for `rank`, make sure to
   * offer a way for final users to customize it inside the plugin's settings
   * form, otherwise the hardcoded value you choose might clash with the one of
   * another plugin!
   */
  rank?: number;
  /**
   * The initial height to set for the iframe that will render the field
   * extension
   */
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
   * the one of another plugin!
   */
  rank?: number;
  /**
   * The initial height to set for the iframe that will render the field
   * extension
   */
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
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible
   */
  icon: Icon;
  /**
   * Expresses where you want the custom mark button to be placed inside the
   * toolbar. If not specified, the item will be placed after the standard marks
   * provided by DatoCMS itself.
   */
  placement?: StructuredTextCustomMarkPlacement;
  /**
   * If multiple custom marks specify the same `placement` for their toolbar
   * button, they will be sorted by ascending `rank`. If you want to specify an
   * explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
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

/**
 * An object expressing some field extensions you want to force on a particular
 * field
 */
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
    /**
     * The initial height to set for the iframe that will render the modal
     * content
     */
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
  /**
   * The intent of the button. Will present the button in a different color
   * accent.
   */
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
  itemTypes: Partial<Record<string, ItemType>>;
  /**
   * The current DatoCMS user. It can either be the owner or one of the
   * collaborators (regular or SSO).
   */
  currentUser: User | SsoUser | Account | Organization;
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
  /**
   * The account that is the project owner
   *
   * @deprecated Please use `.owner` instead, as the project owner can also be
   *   an organization
   */
  account: Account | undefined;
  /** The account that is the project owner */
  owner: Account | Organization;
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

/**
 * These methods let you open the standard DatoCMS dialogs needed to interact
 * with records
 */
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
    (
      itemTypeId: string,
      options: { multiple: true; initialLocationQuery?: ItemListLocationQuery },
    ): Promise<Item[] | null>;
    (
      itemTypeId: string,
      options?: {
        multiple: false;
        initialLocationQuery?: ItemListLocationQuery;
      },
    ): Promise<Item | null>;
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

/**
 * These methods can be used to show UI-consistent toast notifications to the
 * end-user
 */
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
   * Triggers a custom toast displaying the selected message (and optionally a
   * CTA)
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
   * Opens a dialog for editing a Media Area asset. It returns a promise
   * resolved with:
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
  /**
   * If an already persisted record is being edited, returns the full record
   * entity
   */
  item: Item | null;
  /** The model for the record being edited */
  itemType: ItemType;
  /** The complete internal form state */
  formValues: Record<string, unknown>;
  /** The current status of the record being edited */
  itemStatus: 'new' | 'draft' | 'updated' | 'published';
  /** Whether the form is currently submitting itself or not */
  isSubmitting: boolean;
  /** Whether the form has some non-persisted changes or not */
  isFormDirty: boolean;
  /** Current number of blocks present in form state */
  blocksAnalysis: {
    usage: {
      /** Total number of blocks present in form state */
      total: number;
      /** Total number of blocks present in non-localized fields */
      nonLocalized: number;
      /** Total number of blocks present in localized fields, per locale */
      perLocale: Record<string, number>;
    };
    /** Maximum number of blocks per item */
    maximumPerItem: number;
  };
};

export type ItemFormProperties = RenderProperties &
  ItemFormAdditionalProperties;

/**
 * These methods can be used to interact with the form that's being shown to the
 * end-user to edit a record
 */
export type ItemFormAdditionalMethods = {
  /**
   * Hides/shows a specific field in the form. Please be aware that when a field
   * is hidden, the field editor for that field will be removed from the DOM
   * itself, including any associated plugins. When it is shown again, its
   * plugins will be reinitialized.
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
   * localized it will switch language tab and then navigate to the chosen
   * field.
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
   * Takes the internal form state, and transforms it into an Item entity
   * compatible with DatoCMS API.
   *
   * When `skipUnchangedFields`, only the fields that changed value will be
   * serialized.
   *
   * If the required nested blocks are still not loaded, this method will return
   * `undefined`.
   *
   * @example
   *
   * ```js
   * await ctx.formValuesToItem(ctx.formValues, false);
   * ```
   */
  formValuesToItem: (
    formValues: Record<string, unknown>,
    skipUnchangedFields?: boolean,
  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>;
  /**
   * Takes an Item entity, and converts it into the internal form state
   *
   * @example
   *
   * ```js
   * await ctx.itemToFormValues(ctx.item);
   * ```
   */
  itemToFormValues: (
    item: Omit<Item, 'id' | 'meta'>,
  ) => Promise<Record<string, unknown>>;
  /**
   * Triggers a submit form for current record
   *
   * @example
   *
   * ```js
   * await ctx.saveCurrentItem();
   * ```
   */
  saveCurrentItem: (showToast?: boolean) => Promise<void>;
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

export type RenderSidebarPanelPropertiesAndMethods = RenderSidebarPanelMethods &
  RenderSidebarPanelProperties;

/** Information regarding the specific sidebar panel that you need to render */
export type RenderSidebarAdditionalProperties = {
  mode: 'renderItemFormSidebar';
  /** The ID of the sidebar that needs to be rendered */
  sidebarId: string;
  /**
   * The arbitrary `parameters` of the declared in the `itemFormSidebars`
   * function
   */
  parameters: Record<string, unknown>;
};

export type RenderSidebarProperties = ItemFormProperties &
  RenderSidebarAdditionalProperties;

export type RenderSidebarAdditionalMethods = {
  getSettings: () => Promise<RenderSidebarProperties>;
};

export type RenderSidebarMethods = ItemFormMethods &
  RenderSidebarAdditionalMethods;

export type RenderSidebarPropertiesAndMethods = RenderSidebarMethods &
  RenderSidebarProperties;

/** Information regarding the specific outlet that you need to render */
export type RenderItemFormOutletAdditionalProperties = {
  mode: 'renderItemFormOutlet';
  /** The ID of the outlet that needs to be rendered */
  itemFormOutletId: string;
};

export type RenderItemFormOutletProperties = ItemFormProperties &
  RenderItemFormOutletAdditionalProperties;

export type RenderItemFormOutletAdditionalMethods = {
  getSettings: () => Promise<RenderItemFormOutletProperties>;
};

export type RenderItemFormOutletMethods = ItemFormMethods &
  RenderItemFormOutletAdditionalMethods;

export type RenderItemFormOutletPropertiesAndMethods =
  RenderItemFormOutletMethods & RenderItemFormOutletProperties;

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
  /**
   * The path in the `formValues` object where to find the current value for the
   * field
   */
  fieldPath: string;
  /** The field where the field extension is installed to */
  field: Field;
  /**
   * If the field extension is installed in a field of a block, returns the top
   * level Modular Content/Structured Text field containing the block itself
   */
  parentField: Field | undefined;
  /**
   * If the field extension is installed in a field of a block, returns the ID
   * of the block — or `undefined` if the block is still not persisted — and the
   * block model.
   */
  block: undefined | { id: string | undefined; blockModel: ItemType };
};

export type RenderFieldExtensionProperties = ItemFormProperties &
  RenderFieldExtensionAdditionalProperties;

export type RenderFieldExtensionAdditionalMethods = {
  getSettings: () => Promise<RenderFieldExtensionProperties>;
};

export type RenderFieldExtensionMethods = ItemFormMethods &
  RenderFieldExtensionAdditionalMethods;

export type RenderFieldExtensionPropertiesAndMethods =
  RenderFieldExtensionMethods & RenderFieldExtensionProperties;

/** Information regarding the specific custom modal that you need to render */
export type RenderModalAdditionalProperties = {
  mode: 'renderModal';
  /** The ID of the modal that needs to be rendered */
  modalId: string;
  /**
   * The arbitrary `parameters` of the modal declared in the `openModal`
   * function
   */
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

/**
 * Information regarding the specific asset source browser that you need to
 * render
 */
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
  /** Any additional headers to pass when making the request to the URL */
  headers?: Record<string, string>;
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
   *     url: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f',
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
  /**
   * The ID of the field extension for which we need to render the parameters
   * form
   */
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
  itemType: ItemType;
};

export type RenderManualFieldExtensionConfigScreenProperties =
  RenderProperties & RenderManualFieldExtensionConfigScreenAdditionalProperties;

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

export type RenderManualFieldExtensionConfigScreenPropertiesAndMethods =
  RenderManualFieldExtensionConfigScreenMethods &
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

export type AwesomeFontIconIdentifier =
  | '0'
  | '00'
  | '1'
  | '100'
  | '2'
  | '3'
  | '360-degrees'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'abacus'
  | 'accent-grave'
  | 'acorn'
  | 'ad'
  | 'add'
  | 'address-book'
  | 'address-card'
  | 'adjust'
  | 'air-conditioner'
  | 'air-freshener'
  | 'airplay'
  | 'alarm-clock'
  | 'alarm-exclamation'
  | 'alarm-plus'
  | 'alarm-snooze'
  | 'album-circle-plus'
  | 'album-circle-user'
  | 'album-collection-circle-plus'
  | 'album-collection-circle-user'
  | 'album-collection'
  | 'album'
  | 'alicorn'
  | 'alien-8bit'
  | 'alien-monster'
  | 'alien'
  | 'align-center'
  | 'align-justify'
  | 'align-left'
  | 'align-right'
  | 'align-slash'
  | 'allergies'
  | 'alt'
  | 'ambulance'
  | 'american-sign-language-interpreting'
  | 'amp-guitar'
  | 'ampersand'
  | 'analytics'
  | 'anchor-circle-check'
  | 'anchor-circle-exclamation'
  | 'anchor-circle-xmark'
  | 'anchor-lock'
  | 'anchor'
  | 'angel'
  | 'angle-90'
  | 'angle-double-down'
  | 'angle-double-left'
  | 'angle-double-right'
  | 'angle-double-up'
  | 'angle-down'
  | 'angle-left'
  | 'angle-right'
  | 'angle-up'
  | 'angle'
  | 'angles-down'
  | 'angles-left'
  | 'angles-right'
  | 'angles-up'
  | 'angry'
  | 'ankh'
  | 'apartment'
  | 'aperture'
  | 'apostrophe'
  | 'apple-alt'
  | 'apple-core'
  | 'apple-crate'
  | 'apple-whole'
  | 'archive'
  | 'archway'
  | 'area-chart'
  | 'arrow-alt-circle-down'
  | 'arrow-alt-circle-left'
  | 'arrow-alt-circle-right'
  | 'arrow-alt-circle-up'
  | 'arrow-alt-down'
  | 'arrow-alt-from-bottom'
  | 'arrow-alt-from-left'
  | 'arrow-alt-from-right'
  | 'arrow-alt-from-top'
  | 'arrow-alt-left'
  | 'arrow-alt-right'
  | 'arrow-alt-square-down'
  | 'arrow-alt-square-left'
  | 'arrow-alt-square-right'
  | 'arrow-alt-square-up'
  | 'arrow-alt-to-bottom'
  | 'arrow-alt-to-left'
  | 'arrow-alt-to-right'
  | 'arrow-alt-to-top'
  | 'arrow-alt-up'
  | 'arrow-circle-down'
  | 'arrow-circle-left'
  | 'arrow-circle-right'
  | 'arrow-circle-up'
  | 'arrow-down-1-9'
  | 'arrow-down-9-1'
  | 'arrow-down-a-z'
  | 'arrow-down-arrow-up'
  | 'arrow-down-big-small'
  | 'arrow-down-from-dotted-line'
  | 'arrow-down-from-line'
  | 'arrow-down-left-and-arrow-up-right-to-center'
  | 'arrow-down-left'
  | 'arrow-down-long'
  | 'arrow-down-right'
  | 'arrow-down-short-wide'
  | 'arrow-down-small-big'
  | 'arrow-down-square-triangle'
  | 'arrow-down-to-arc'
  | 'arrow-down-to-bracket'
  | 'arrow-down-to-dotted-line'
  | 'arrow-down-to-line'
  | 'arrow-down-to-square'
  | 'arrow-down-triangle-square'
  | 'arrow-down-up-across-line'
  | 'arrow-down-up-lock'
  | 'arrow-down-wide-short'
  | 'arrow-down-z-a'
  | 'arrow-down'
  | 'arrow-from-bottom'
  | 'arrow-from-left'
  | 'arrow-from-right'
  | 'arrow-from-top'
  | 'arrow-left-from-line'
  | 'arrow-left-long-to-line'
  | 'arrow-left-long'
  | 'arrow-left-rotate'
  | 'arrow-left-to-line'
  | 'arrow-left'
  | 'arrow-pointer'
  | 'arrow-progress'
  | 'arrow-right-arrow-left'
  | 'arrow-right-from-arc'
  | 'arrow-right-from-bracket'
  | 'arrow-right-from-file'
  | 'arrow-right-from-line'
  | 'arrow-right-long-to-line'
  | 'arrow-right-long'
  | 'arrow-right-rotate'
  | 'arrow-right-to-arc'
  | 'arrow-right-to-bracket'
  | 'arrow-right-to-city'
  | 'arrow-right-to-file'
  | 'arrow-right-to-line'
  | 'arrow-right'
  | 'arrow-rotate-back'
  | 'arrow-rotate-backward'
  | 'arrow-rotate-forward'
  | 'arrow-rotate-left'
  | 'arrow-rotate-right'
  | 'arrow-square-down'
  | 'arrow-square-left'
  | 'arrow-square-right'
  | 'arrow-square-up'
  | 'arrow-to-bottom'
  | 'arrow-to-left'
  | 'arrow-to-right'
  | 'arrow-to-top'
  | 'arrow-trend-down'
  | 'arrow-trend-up'
  | 'arrow-turn-down-left'
  | 'arrow-turn-down-right'
  | 'arrow-turn-down'
  | 'arrow-turn-right'
  | 'arrow-turn-up'
  | 'arrow-up-1-9'
  | 'arrow-up-9-1'
  | 'arrow-up-a-z'
  | 'arrow-up-arrow-down'
  | 'arrow-up-big-small'
  | 'arrow-up-from-arc'
  | 'arrow-up-from-bracket'
  | 'arrow-up-from-dotted-line'
  | 'arrow-up-from-ground-water'
  | 'arrow-up-from-line'
  | 'arrow-up-from-square'
  | 'arrow-up-from-water-pump'
  | 'arrow-up-left-from-circle'
  | 'arrow-up-left'
  | 'arrow-up-long'
  | 'arrow-up-right-and-arrow-down-left-from-center'
  | 'arrow-up-right-dots'
  | 'arrow-up-right-from-square'
  | 'arrow-up-right'
  | 'arrow-up-short-wide'
  | 'arrow-up-small-big'
  | 'arrow-up-square-triangle'
  | 'arrow-up-to-dotted-line'
  | 'arrow-up-to-line'
  | 'arrow-up-triangle-square'
  | 'arrow-up-wide-short'
  | 'arrow-up-z-a'
  | 'arrow-up'
  | 'arrows-alt-h'
  | 'arrows-alt-v'
  | 'arrows-alt'
  | 'arrows-cross'
  | 'arrows-down-to-line'
  | 'arrows-down-to-people'
  | 'arrows-from-dotted-line'
  | 'arrows-from-line'
  | 'arrows-h'
  | 'arrows-left-right-to-line'
  | 'arrows-left-right'
  | 'arrows-maximize'
  | 'arrows-minimize'
  | 'arrows-repeat-1'
  | 'arrows-repeat'
  | 'arrows-retweet'
  | 'arrows-rotate'
  | 'arrows-spin'
  | 'arrows-split-up-and-left'
  | 'arrows-to-circle'
  | 'arrows-to-dot'
  | 'arrows-to-dotted-line'
  | 'arrows-to-eye'
  | 'arrows-to-line'
  | 'arrows-turn-right'
  | 'arrows-turn-to-dots'
  | 'arrows-up-down-left-right'
  | 'arrows-up-down'
  | 'arrows-up-to-line'
  | 'arrows-v'
  | 'arrows'
  | 'asl-interpreting'
  | 'assistive-listening-systems'
  | 'asterisk'
  | 'at'
  | 'atlas'
  | 'atom-alt'
  | 'atom-simple'
  | 'atom'
  | 'audio-description-slash'
  | 'audio-description'
  | 'austral-sign'
  | 'automobile'
  | 'avocado'
  | 'award-simple'
  | 'award'
  | 'axe-battle'
  | 'axe'
  | 'b'
  | 'baby-carriage'
  | 'baby'
  | 'backpack'
  | 'backspace'
  | 'backward-fast'
  | 'backward-step'
  | 'backward'
  | 'bacon'
  | 'bacteria'
  | 'bacterium'
  | 'badge-check'
  | 'badge-dollar'
  | 'badge-percent'
  | 'badge-sheriff'
  | 'badge'
  | 'badger-honey'
  | 'badminton'
  | 'bag-seedling'
  | 'bag-shopping'
  | 'bagel'
  | 'bags-shopping'
  | 'baguette'
  | 'bahai'
  | 'baht-sign'
  | 'balance-scale-left'
  | 'balance-scale-right'
  | 'balance-scale'
  | 'ball-pile'
  | 'balloon'
  | 'balloons'
  | 'ballot-check'
  | 'ballot'
  | 'ban-bug'
  | 'ban-parking'
  | 'ban-smoking'
  | 'ban'
  | 'banana'
  | 'band-aid'
  | 'bandage'
  | 'bangladeshi-taka-sign'
  | 'banjo'
  | 'bank'
  | 'bar-chart'
  | 'barcode-alt'
  | 'barcode-read'
  | 'barcode-scan'
  | 'barcode'
  | 'barn-silo'
  | 'bars-filter'
  | 'bars-progress'
  | 'bars-sort'
  | 'bars-staggered'
  | 'bars'
  | 'baseball-ball'
  | 'baseball-bat-ball'
  | 'baseball'
  | 'basket-shopping-simple'
  | 'basket-shopping'
  | 'basketball-ball'
  | 'basketball-hoop'
  | 'basketball'
  | 'bat'
  | 'bath'
  | 'bathtub'
  | 'battery-0'
  | 'battery-1'
  | 'battery-2'
  | 'battery-3'
  | 'battery-4'
  | 'battery-5'
  | 'battery-bolt'
  | 'battery-car'
  | 'battery-empty'
  | 'battery-exclamation'
  | 'battery-full'
  | 'battery-half'
  | 'battery-low'
  | 'battery-quarter'
  | 'battery-slash'
  | 'battery-three-quarters'
  | 'battery'
  | 'bed-alt'
  | 'bed-bunk'
  | 'bed-empty'
  | 'bed-front'
  | 'bed-pulse'
  | 'bed'
  | 'bee'
  | 'beer-foam'
  | 'beer-mug-empty'
  | 'beer-mug'
  | 'beer'
  | 'bell-concierge'
  | 'bell-exclamation'
  | 'bell-on'
  | 'bell-plus'
  | 'bell-school-slash'
  | 'bell-school'
  | 'bell-slash'
  | 'bell'
  | 'bells'
  | 'bench-tree'
  | 'betamax'
  | 'bezier-curve'
  | 'bible'
  | 'bicycle'
  | 'biking-mountain'
  | 'biking'
  | 'billboard'
  | 'bin-bottles-recycle'
  | 'bin-bottles'
  | 'bin-recycle'
  | 'binary-circle-check'
  | 'binary-lock'
  | 'binary-slash'
  | 'binary'
  | 'binoculars'
  | 'biohazard'
  | 'bird'
  | 'birthday-cake'
  | 'bitcoin-sign'
  | 'blackboard'
  | 'blanket-fire'
  | 'blanket'
  | 'blender-phone'
  | 'blender'
  | 'blind'
  | 'blinds-open'
  | 'blinds-raised'
  | 'blinds'
  | 'block-brick-fire'
  | 'block-brick'
  | 'block-question'
  | 'block-quote'
  | 'block'
  | 'blog'
  | 'blueberries'
  | 'bluetooth'
  | 'bold'
  | 'bolt-auto'
  | 'bolt-lightning'
  | 'bolt-slash'
  | 'bolt'
  | 'bomb'
  | 'bone-break'
  | 'bone'
  | 'bong'
  | 'book-alt'
  | 'book-arrow-right'
  | 'book-arrow-up'
  | 'book-atlas'
  | 'book-bible'
  | 'book-blank'
  | 'book-bookmark'
  | 'book-circle-arrow-right'
  | 'book-circle-arrow-up'
  | 'book-circle'
  | 'book-copy'
  | 'book-dead'
  | 'book-font'
  | 'book-heart'
  | 'book-journal-whills'
  | 'book-law'
  | 'book-medical'
  | 'book-open-alt'
  | 'book-open-cover'
  | 'book-open-reader'
  | 'book-open'
  | 'book-quran'
  | 'book-reader'
  | 'book-section'
  | 'book-skull'
  | 'book-sparkles'
  | 'book-spells'
  | 'book-tanakh'
  | 'book-user'
  | 'book'
  | 'bookmark-circle'
  | 'bookmark-slash'
  | 'bookmark'
  | 'books-medical'
  | 'books'
  | 'boombox'
  | 'boot-heeled'
  | 'boot'
  | 'booth-curtain'
  | 'border-all'
  | 'border-bottom-right'
  | 'border-bottom'
  | 'border-center-h'
  | 'border-center-v'
  | 'border-inner'
  | 'border-left'
  | 'border-none'
  | 'border-outer'
  | 'border-right'
  | 'border-style-alt'
  | 'border-style'
  | 'border-top-left'
  | 'border-top'
  | 'bore-hole'
  | 'bottle-droplet'
  | 'bottle-water'
  | 'bow-arrow'
  | 'bowl-chopsticks-noodles'
  | 'bowl-chopsticks'
  | 'bowl-food'
  | 'bowl-hot'
  | 'bowl-rice'
  | 'bowl-salad'
  | 'bowl-scoop'
  | 'bowl-scoops'
  | 'bowl-shaved-ice'
  | 'bowl-soft-serve'
  | 'bowl-spoon'
  | 'bowling-ball-pin'
  | 'bowling-ball'
  | 'bowling-pins'
  | 'box-alt'
  | 'box-archive'
  | 'box-ballot'
  | 'box-check'
  | 'box-circle-check'
  | 'box-dollar'
  | 'box-fragile'
  | 'box-full'
  | 'box-heart'
  | 'box-open-full'
  | 'box-open'
  | 'box-taped'
  | 'box-tissue'
  | 'box-up'
  | 'box-usd'
  | 'box'
  | 'boxes-alt'
  | 'boxes-packing'
  | 'boxes-stacked'
  | 'boxes'
  | 'boxing-glove'
  | 'bracket-curly-left'
  | 'bracket-curly-right'
  | 'bracket-curly'
  | 'bracket-left'
  | 'bracket-round-right'
  | 'bracket-round'
  | 'bracket-square-right'
  | 'bracket-square'
  | 'bracket'
  | 'brackets-curly'
  | 'brackets-round'
  | 'brackets-square'
  | 'brackets'
  | 'braille'
  | 'brain-arrow-curved-right'
  | 'brain-circuit'
  | 'brain'
  | 'brake-warning'
  | 'brazilian-real-sign'
  | 'bread-loaf'
  | 'bread-slice-butter'
  | 'bread-slice'
  | 'bridge-circle-check'
  | 'bridge-circle-exclamation'
  | 'bridge-circle-xmark'
  | 'bridge-lock'
  | 'bridge-suspension'
  | 'bridge-water'
  | 'bridge'
  | 'briefcase-arrow-right'
  | 'briefcase-blank'
  | 'briefcase-clock'
  | 'briefcase-medical'
  | 'briefcase'
  | 'brightness-low'
  | 'brightness'
  | 'bring-forward'
  | 'bring-front'
  | 'broadcast-tower'
  | 'broccoli'
  | 'broom-ball'
  | 'broom-wide'
  | 'broom'
  | 'browser'
  | 'browsers'
  | 'brush'
  | 'bucket'
  | 'bug-slash'
  | 'bug'
  | 'bugs'
  | 'building-circle-arrow-right'
  | 'building-circle-check'
  | 'building-circle-exclamation'
  | 'building-circle-xmark'
  | 'building-columns'
  | 'building-flag'
  | 'building-lock'
  | 'building-ngo'
  | 'building-shield'
  | 'building-un'
  | 'building-user'
  | 'building-wheat'
  | 'building'
  | 'buildings'
  | 'bullhorn'
  | 'bullseye-arrow'
  | 'bullseye-pointer'
  | 'bullseye'
  | 'buoy-mooring'
  | 'buoy'
  | 'burger-cheese'
  | 'burger-fries'
  | 'burger-glass'
  | 'burger-lettuce'
  | 'burger-soda'
  | 'burger'
  | 'burn'
  | 'burrito'
  | 'burst'
  | 'bus-alt'
  | 'bus-school'
  | 'bus-simple'
  | 'bus'
  | 'business-front'
  | 'business-time'
  | 'butter'
  | 'c'
  | 'cab'
  | 'cabin'
  | 'cabinet-filing'
  | 'cable-car'
  | 'cactus'
  | 'cake-candles'
  | 'cake-slice'
  | 'cake'
  | 'calculator-alt'
  | 'calculator-simple'
  | 'calculator'
  | 'calendar-alt'
  | 'calendar-arrow-down'
  | 'calendar-arrow-up'
  | 'calendar-check'
  | 'calendar-circle-exclamation'
  | 'calendar-circle-minus'
  | 'calendar-circle-plus'
  | 'calendar-circle-user'
  | 'calendar-circle'
  | 'calendar-clock'
  | 'calendar-day'
  | 'calendar-days'
  | 'calendar-download'
  | 'calendar-edit'
  | 'calendar-exclamation'
  | 'calendar-heart'
  | 'calendar-image'
  | 'calendar-lines-pen'
  | 'calendar-lines'
  | 'calendar-minus'
  | 'calendar-note'
  | 'calendar-pen'
  | 'calendar-plus'
  | 'calendar-range'
  | 'calendar-star'
  | 'calendar-time'
  | 'calendar-times'
  | 'calendar-upload'
  | 'calendar-users'
  | 'calendar-week'
  | 'calendar-xmark'
  | 'calendar'
  | 'calendars'
  | 'camcorder'
  | 'camera-alt'
  | 'camera-cctv'
  | 'camera-circle'
  | 'camera-home'
  | 'camera-movie'
  | 'camera-polaroid'
  | 'camera-retro'
  | 'camera-rotate'
  | 'camera-security'
  | 'camera-slash'
  | 'camera-viewfinder'
  | 'camera-web-slash'
  | 'camera-web'
  | 'camera'
  | 'campfire'
  | 'campground'
  | 'can-food'
  | 'cancel'
  | 'candle-holder'
  | 'candy-bar'
  | 'candy-cane'
  | 'candy-corn'
  | 'candy'
  | 'cannabis'
  | 'capsules'
  | 'car-alt'
  | 'car-battery'
  | 'car-bolt'
  | 'car-building'
  | 'car-bump'
  | 'car-burst'
  | 'car-bus'
  | 'car-circle-bolt'
  | 'car-crash'
  | 'car-garage'
  | 'car-mechanic'
  | 'car-mirrors'
  | 'car-on'
  | 'car-rear'
  | 'car-side-bolt'
  | 'car-side'
  | 'car-tilt'
  | 'car-tunnel'
  | 'car-wash'
  | 'car-wrench'
  | 'car'
  | 'caravan-alt'
  | 'caravan-simple'
  | 'caravan'
  | 'card-club'
  | 'card-diamond'
  | 'card-heart'
  | 'card-spade'
  | 'cards-blank'
  | 'cards'
  | 'caret-circle-down'
  | 'caret-circle-left'
  | 'caret-circle-right'
  | 'caret-circle-up'
  | 'caret-down'
  | 'caret-left'
  | 'caret-right'
  | 'caret-square-down'
  | 'caret-square-left'
  | 'caret-square-right'
  | 'caret-square-up'
  | 'caret-up'
  | 'carriage-baby'
  | 'carrot'
  | 'cars'
  | 'cart-arrow-down'
  | 'cart-arrow-up'
  | 'cart-circle-arrow-down'
  | 'cart-circle-arrow-up'
  | 'cart-circle-check'
  | 'cart-circle-exclamation'
  | 'cart-circle-plus'
  | 'cart-circle-xmark'
  | 'cart-flatbed-boxes'
  | 'cart-flatbed-empty'
  | 'cart-flatbed-suitcase'
  | 'cart-flatbed'
  | 'cart-minus'
  | 'cart-plus'
  | 'cart-shopping-fast'
  | 'cart-shopping'
  | 'cart-xmark'
  | 'cash-register'
  | 'cassette-betamax'
  | 'cassette-tape'
  | 'cassette-vhs'
  | 'castle'
  | 'cat-space'
  | 'cat'
  | 'cauldron'
  | 'cctv'
  | 'cedi-sign'
  | 'cent-sign'
  | 'certificate'
  | 'chain-broken'
  | 'chain-horizontal-slash'
  | 'chain-horizontal'
  | 'chain-slash'
  | 'chain'
  | 'chair-office'
  | 'chair'
  | 'chalkboard-teacher'
  | 'chalkboard-user'
  | 'chalkboard'
  | 'champagne-glass'
  | 'champagne-glasses'
  | 'charging-station'
  | 'chart-area'
  | 'chart-bar'
  | 'chart-bullet'
  | 'chart-candlestick'
  | 'chart-column'
  | 'chart-gantt'
  | 'chart-line-down'
  | 'chart-line-up-down'
  | 'chart-line-up'
  | 'chart-line'
  | 'chart-mixed-up-circle-currency'
  | 'chart-mixed-up-circle-dollar'
  | 'chart-mixed'
  | 'chart-network'
  | 'chart-pie-alt'
  | 'chart-pie-simple-circle-currency'
  | 'chart-pie-simple-circle-dollar'
  | 'chart-pie-simple'
  | 'chart-pie'
  | 'chart-pyramid'
  | 'chart-radar'
  | 'chart-scatter-3d'
  | 'chart-scatter-bubble'
  | 'chart-scatter'
  | 'chart-simple-horizontal'
  | 'chart-simple'
  | 'chart-tree-map'
  | 'chart-user'
  | 'chart-waterfall'
  | 'check-circle'
  | 'check-double'
  | 'check-square'
  | 'check-to-slot'
  | 'check'
  | 'cheese-swiss'
  | 'cheese'
  | 'cheeseburger'
  | 'cherries'
  | 'chess-bishop-alt'
  | 'chess-bishop-piece'
  | 'chess-bishop'
  | 'chess-board'
  | 'chess-clock-alt'
  | 'chess-clock-flip'
  | 'chess-clock'
  | 'chess-king-alt'
  | 'chess-king-piece'
  | 'chess-king'
  | 'chess-knight-alt'
  | 'chess-knight-piece'
  | 'chess-knight'
  | 'chess-pawn-alt'
  | 'chess-pawn-piece'
  | 'chess-pawn'
  | 'chess-queen-alt'
  | 'chess-queen-piece'
  | 'chess-queen'
  | 'chess-rook-alt'
  | 'chess-rook-piece'
  | 'chess-rook'
  | 'chess'
  | 'chestnut'
  | 'chevron-circle-down'
  | 'chevron-circle-left'
  | 'chevron-circle-right'
  | 'chevron-circle-up'
  | 'chevron-double-down'
  | 'chevron-double-left'
  | 'chevron-double-right'
  | 'chevron-double-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-square-down'
  | 'chevron-square-left'
  | 'chevron-square-right'
  | 'chevron-square-up'
  | 'chevron-up'
  | 'chevrons-down'
  | 'chevrons-left'
  | 'chevrons-right'
  | 'chevrons-up'
  | 'chf-sign'
  | 'child-combatant'
  | 'child-dress'
  | 'child-reaching'
  | 'child-rifle'
  | 'child'
  | 'children'
  | 'chimney'
  | 'chocolate-bar'
  | 'chopsticks'
  | 'church'
  | 'circle-0'
  | 'circle-1'
  | 'circle-2'
  | 'circle-3'
  | 'circle-4'
  | 'circle-5'
  | 'circle-6'
  | 'circle-7'
  | 'circle-8'
  | 'circle-9'
  | 'circle-a'
  | 'circle-ampersand'
  | 'circle-arrow-down-left'
  | 'circle-arrow-down-right'
  | 'circle-arrow-down'
  | 'circle-arrow-left'
  | 'circle-arrow-right'
  | 'circle-arrow-up-left'
  | 'circle-arrow-up-right'
  | 'circle-arrow-up'
  | 'circle-b'
  | 'circle-bolt'
  | 'circle-book-open'
  | 'circle-bookmark'
  | 'circle-c'
  | 'circle-calendar'
  | 'circle-camera'
  | 'circle-caret-down'
  | 'circle-caret-left'
  | 'circle-caret-right'
  | 'circle-caret-up'
  | 'circle-check'
  | 'circle-chevron-down'
  | 'circle-chevron-left'
  | 'circle-chevron-right'
  | 'circle-chevron-up'
  | 'circle-d'
  | 'circle-dashed'
  | 'circle-divide'
  | 'circle-dollar-to-slot'
  | 'circle-dollar'
  | 'circle-dot'
  | 'circle-down-left'
  | 'circle-down-right'
  | 'circle-down'
  | 'circle-e'
  | 'circle-ellipsis-vertical'
  | 'circle-ellipsis'
  | 'circle-envelope'
  | 'circle-euro'
  | 'circle-exclamation-check'
  | 'circle-exclamation'
  | 'circle-f'
  | 'circle-g'
  | 'circle-h'
  | 'circle-half-stroke'
  | 'circle-half'
  | 'circle-heart'
  | 'circle-i'
  | 'circle-info'
  | 'circle-j'
  | 'circle-k'
  | 'circle-l'
  | 'circle-left'
  | 'circle-location-arrow'
  | 'circle-m'
  | 'circle-microphone-lines'
  | 'circle-microphone'
  | 'circle-minus'
  | 'circle-n'
  | 'circle-nodes'
  | 'circle-notch'
  | 'circle-o'
  | 'circle-p'
  | 'circle-parking'
  | 'circle-pause'
  | 'circle-phone-flip'
  | 'circle-phone-hangup'
  | 'circle-phone'
  | 'circle-play'
  | 'circle-plus'
  | 'circle-q'
  | 'circle-quarter-stroke'
  | 'circle-quarter'
  | 'circle-quarters'
  | 'circle-question'
  | 'circle-r'
  | 'circle-radiation'
  | 'circle-right'
  | 'circle-s'
  | 'circle-small'
  | 'circle-sort-down'
  | 'circle-sort-up'
  | 'circle-sort'
  | 'circle-star'
  | 'circle-sterling'
  | 'circle-stop'
  | 'circle-t'
  | 'circle-three-quarters-stroke'
  | 'circle-three-quarters'
  | 'circle-trash'
  | 'circle-u'
  | 'circle-up-left'
  | 'circle-up-right'
  | 'circle-up'
  | 'circle-user'
  | 'circle-v'
  | 'circle-video'
  | 'circle-w'
  | 'circle-waveform-lines'
  | 'circle-x'
  | 'circle-xmark'
  | 'circle-y'
  | 'circle-yen'
  | 'circle-z'
  | 'circle'
  | 'circles-overlap'
  | 'citrus-slice'
  | 'citrus'
  | 'city'
  | 'clapperboard-play'
  | 'clapperboard'
  | 'clarinet'
  | 'claw-marks'
  | 'clinic-medical'
  | 'clipboard-check'
  | 'clipboard-list-check'
  | 'clipboard-list'
  | 'clipboard-medical'
  | 'clipboard-prescription'
  | 'clipboard-question'
  | 'clipboard-user'
  | 'clipboard'
  | 'clock-desk'
  | 'clock-eight-thirty'
  | 'clock-eight'
  | 'clock-eleven-thirty'
  | 'clock-eleven'
  | 'clock-five-thirty'
  | 'clock-five'
  | 'clock-four-thirty'
  | 'clock-four'
  | 'clock-nine-thirty'
  | 'clock-nine'
  | 'clock-one-thirty'
  | 'clock-one'
  | 'clock-rotate-left'
  | 'clock-seven-thirty'
  | 'clock-seven'
  | 'clock-six-thirty'
  | 'clock-six'
  | 'clock-ten-thirty'
  | 'clock-ten'
  | 'clock-three-thirty'
  | 'clock-three'
  | 'clock-twelve-thirty'
  | 'clock-twelve'
  | 'clock-two-thirty'
  | 'clock-two'
  | 'clock'
  | 'clone'
  | 'close'
  | 'closed-captioning-slash'
  | 'closed-captioning'
  | 'clothes-hanger'
  | 'cloud-arrow-down'
  | 'cloud-arrow-up'
  | 'cloud-binary'
  | 'cloud-bolt-moon'
  | 'cloud-bolt-sun'
  | 'cloud-bolt'
  | 'cloud-check'
  | 'cloud-download-alt'
  | 'cloud-download'
  | 'cloud-drizzle'
  | 'cloud-exclamation'
  | 'cloud-fog'
  | 'cloud-hail-mixed'
  | 'cloud-hail'
  | 'cloud-meatball'
  | 'cloud-minus'
  | 'cloud-moon-rain'
  | 'cloud-moon'
  | 'cloud-music'
  | 'cloud-plus'
  | 'cloud-question'
  | 'cloud-rain'
  | 'cloud-rainbow'
  | 'cloud-showers-heavy'
  | 'cloud-showers-water'
  | 'cloud-showers'
  | 'cloud-slash'
  | 'cloud-sleet'
  | 'cloud-snow'
  | 'cloud-sun-rain'
  | 'cloud-sun'
  | 'cloud-upload-alt'
  | 'cloud-upload'
  | 'cloud-word'
  | 'cloud-xmark'
  | 'cloud'
  | 'clouds-moon'
  | 'clouds-sun'
  | 'clouds'
  | 'clover'
  | 'club'
  | 'cny'
  | 'cocktail'
  | 'coconut'
  | 'code-branch'
  | 'code-commit'
  | 'code-compare'
  | 'code-fork'
  | 'code-merge'
  | 'code-pull-request-closed'
  | 'code-pull-request-draft'
  | 'code-pull-request'
  | 'code-simple'
  | 'code'
  | 'coffee-bean'
  | 'coffee-beans'
  | 'coffee-pot'
  | 'coffee-togo'
  | 'coffee'
  | 'coffin-cross'
  | 'coffin'
  | 'cog'
  | 'cogs'
  | 'coin-blank'
  | 'coin-front'
  | 'coin-vertical'
  | 'coin'
  | 'coins'
  | 'colon-sign'
  | 'colon'
  | 'columns-3'
  | 'columns'
  | 'comet'
  | 'comma'
  | 'command'
  | 'comment-alt-arrow-down'
  | 'comment-alt-arrow-up'
  | 'comment-alt-captions'
  | 'comment-alt-check'
  | 'comment-alt-dollar'
  | 'comment-alt-dots'
  | 'comment-alt-edit'
  | 'comment-alt-exclamation'
  | 'comment-alt-image'
  | 'comment-alt-lines'
  | 'comment-alt-medical'
  | 'comment-alt-minus'
  | 'comment-alt-music'
  | 'comment-alt-plus'
  | 'comment-alt-quote'
  | 'comment-alt-slash'
  | 'comment-alt-smile'
  | 'comment-alt-text'
  | 'comment-alt-times'
  | 'comment-alt'
  | 'comment-arrow-down'
  | 'comment-arrow-up-right'
  | 'comment-arrow-up'
  | 'comment-captions'
  | 'comment-check'
  | 'comment-code'
  | 'comment-dollar'
  | 'comment-dots'
  | 'comment-edit'
  | 'comment-exclamation'
  | 'comment-heart'
  | 'comment-image'
  | 'comment-lines'
  | 'comment-medical'
  | 'comment-middle-alt'
  | 'comment-middle-top-alt'
  | 'comment-middle-top'
  | 'comment-middle'
  | 'comment-minus'
  | 'comment-music'
  | 'comment-pen'
  | 'comment-plus'
  | 'comment-question'
  | 'comment-quote'
  | 'comment-slash'
  | 'comment-smile'
  | 'comment-sms'
  | 'comment-text'
  | 'comment-times'
  | 'comment-xmark'
  | 'comment'
  | 'commenting'
  | 'comments-alt-dollar'
  | 'comments-alt'
  | 'comments-dollar'
  | 'comments-question-check'
  | 'comments-question'
  | 'comments'
  | 'compact-disc'
  | 'compass-drafting'
  | 'compass-slash'
  | 'compass'
  | 'compress-alt'
  | 'compress-arrows-alt'
  | 'compress-arrows'
  | 'compress-wide'
  | 'compress'
  | 'computer-classic'
  | 'computer-mouse-scrollwheel'
  | 'computer-mouse'
  | 'computer-speaker'
  | 'computer'
  | 'concierge-bell'
  | 'construction'
  | 'contact-book'
  | 'contact-card'
  | 'container-storage'
  | 'conveyor-belt-alt'
  | 'conveyor-belt-arm'
  | 'conveyor-belt-boxes'
  | 'conveyor-belt-empty'
  | 'conveyor-belt'
  | 'cookie-bite'
  | 'cookie'
  | 'copy'
  | 'copyright'
  | 'corn'
  | 'corner'
  | 'couch-small'
  | 'couch'
  | 'cow'
  | 'cowbell-circle-plus'
  | 'cowbell-more'
  | 'cowbell'
  | 'crab'
  | 'crate-apple'
  | 'crate-empty'
  | 'credit-card-alt'
  | 'credit-card-blank'
  | 'credit-card-front'
  | 'credit-card'
  | 'creemee'
  | 'cricket-bat-ball'
  | 'cricket'
  | 'croissant'
  | 'crop-alt'
  | 'crop-simple'
  | 'crop'
  | 'cross'
  | 'crosshairs-simple'
  | 'crosshairs'
  | 'crow'
  | 'crown'
  | 'crutch'
  | 'crutches'
  | 'cruzeiro-sign'
  | 'crystal-ball'
  | 'cube'
  | 'cubes-stacked'
  | 'cubes'
  | 'cucumber'
  | 'cup-straw-swoosh'
  | 'cup-straw'
  | 'cup-togo'
  | 'cupcake'
  | 'curling-stone'
  | 'curling'
  | 'custard'
  | 'cut'
  | 'cutlery'
  | 'd'
  | 'dagger'
  | 'dash'
  | 'dashboard'
  | 'database'
  | 'deaf'
  | 'deafness'
  | 'debug'
  | 'dedent'
  | 'deer-rudolph'
  | 'deer'
  | 'delete-left'
  | 'delete-right'
  | 'democrat'
  | 'desktop-alt'
  | 'desktop-arrow-down'
  | 'desktop-code'
  | 'desktop-medical'
  | 'desktop-slash'
  | 'desktop'
  | 'dewpoint'
  | 'dharmachakra'
  | 'diagnoses'
  | 'diagram-cells'
  | 'diagram-lean-canvas'
  | 'diagram-nested'
  | 'diagram-next'
  | 'diagram-predecessor'
  | 'diagram-previous'
  | 'diagram-project'
  | 'diagram-sankey'
  | 'diagram-subtask'
  | 'diagram-successor'
  | 'diagram-venn'
  | 'dial-high'
  | 'dial-low'
  | 'dial-max'
  | 'dial-med-high'
  | 'dial-med-low'
  | 'dial-med'
  | 'dial-min'
  | 'dial-off'
  | 'dial'
  | 'diamond-exclamation'
  | 'diamond-half-stroke'
  | 'diamond-half'
  | 'diamond-turn-right'
  | 'diamond'
  | 'dice-d10'
  | 'dice-d12'
  | 'dice-d20'
  | 'dice-d4'
  | 'dice-d6'
  | 'dice-d8'
  | 'dice-five'
  | 'dice-four'
  | 'dice-one'
  | 'dice-six'
  | 'dice-three'
  | 'dice-two'
  | 'dice'
  | 'digging'
  | 'digital-tachograph'
  | 'dinosaur'
  | 'diploma'
  | 'directions'
  | 'disc-drive'
  | 'disease'
  | 'display-arrow-down'
  | 'display-chart-up-circle-currency'
  | 'display-chart-up-circle-dollar'
  | 'display-chart-up'
  | 'display-code'
  | 'display-medical'
  | 'display-slash'
  | 'display'
  | 'distribute-spacing-horizontal'
  | 'distribute-spacing-vertical'
  | 'ditto'
  | 'divide'
  | 'dizzy'
  | 'dna'
  | 'do-not-enter'
  | 'dog-leashed'
  | 'dog'
  | 'dollar-circle'
  | 'dollar-sign'
  | 'dollar-square'
  | 'dollar'
  | 'dolly-box'
  | 'dolly-empty'
  | 'dolly-flatbed-alt'
  | 'dolly-flatbed-empty'
  | 'dolly-flatbed'
  | 'dolly'
  | 'dolphin'
  | 'donate'
  | 'dong-sign'
  | 'donut'
  | 'door-closed'
  | 'door-open'
  | 'dot-circle'
  | 'doughnut'
  | 'dove'
  | 'down-from-dotted-line'
  | 'down-from-line'
  | 'down-left-and-up-right-to-center'
  | 'down-left'
  | 'down-long'
  | 'down-right'
  | 'down-to-bracket'
  | 'down-to-dotted-line'
  | 'down-to-line'
  | 'down'
  | 'download'
  | 'drafting-compass'
  | 'dragon'
  | 'draw-circle'
  | 'draw-polygon'
  | 'draw-square'
  | 'dreidel'
  | 'drivers-license'
  | 'drone-alt'
  | 'drone-front'
  | 'drone'
  | 'droplet-degree'
  | 'droplet-percent'
  | 'droplet-slash'
  | 'droplet'
  | 'drum-steelpan'
  | 'drum'
  | 'drumstick-bite'
  | 'drumstick'
  | 'dryer-alt'
  | 'dryer-heat'
  | 'dryer'
  | 'duck'
  | 'dumbbell'
  | 'dumpster-fire'
  | 'dumpster'
  | 'dungeon'
  | 'e'
  | 'ear-deaf'
  | 'ear-listen'
  | 'ear-muffs'
  | 'ear'
  | 'earth-africa'
  | 'earth-america'
  | 'earth-americas'
  | 'earth-asia'
  | 'earth-europe'
  | 'earth-oceania'
  | 'earth'
  | 'eclipse-alt'
  | 'eclipse'
  | 'edit'
  | 'egg-fried'
  | 'egg'
  | 'eggplant'
  | 'eject'
  | 'elephant'
  | 'elevator'
  | 'ellipsis-h-alt'
  | 'ellipsis-h'
  | 'ellipsis-stroke-vertical'
  | 'ellipsis-stroke'
  | 'ellipsis-v-alt'
  | 'ellipsis-v'
  | 'ellipsis-vertical'
  | 'ellipsis'
  | 'empty-set'
  | 'engine-exclamation'
  | 'engine-warning'
  | 'engine'
  | 'envelope-badge'
  | 'envelope-circle-check'
  | 'envelope-circle'
  | 'envelope-dot'
  | 'envelope-open-dollar'
  | 'envelope-open-text'
  | 'envelope-open'
  | 'envelope-square'
  | 'envelope'
  | 'envelopes-bulk'
  | 'envelopes'
  | 'equals'
  | 'eraser'
  | 'escalator'
  | 'ethernet'
  | 'eur'
  | 'euro-sign'
  | 'euro'
  | 'exchange-alt'
  | 'exchange'
  | 'exclamation-circle'
  | 'exclamation-square'
  | 'exclamation-triangle'
  | 'exclamation'
  | 'expand-alt'
  | 'expand-arrows-alt'
  | 'expand-arrows'
  | 'expand-wide'
  | 'expand'
  | 'exploding-head'
  | 'explosion'
  | 'external-link-alt'
  | 'external-link-square-alt'
  | 'external-link-square'
  | 'external-link'
  | 'eye-dropper-empty'
  | 'eye-dropper-full'
  | 'eye-dropper-half'
  | 'eye-dropper'
  | 'eye-evil'
  | 'eye-low-vision'
  | 'eye-slash'
  | 'eye'
  | 'eyedropper'
  | 'eyes'
  | 'f'
  | 'face-angry-horns'
  | 'face-angry'
  | 'face-anguished'
  | 'face-anxious-sweat'
  | 'face-astonished'
  | 'face-awesome'
  | 'face-beam-hand-over-mouth'
  | 'face-clouds'
  | 'face-confounded'
  | 'face-confused'
  | 'face-cowboy-hat'
  | 'face-diagonal-mouth'
  | 'face-disappointed'
  | 'face-disguise'
  | 'face-dizzy'
  | 'face-dotted'
  | 'face-downcast-sweat'
  | 'face-drooling'
  | 'face-exhaling'
  | 'face-explode'
  | 'face-expressionless'
  | 'face-eyes-xmarks'
  | 'face-fearful'
  | 'face-flushed'
  | 'face-frown-open'
  | 'face-frown-slight'
  | 'face-frown'
  | 'face-glasses'
  | 'face-grimace'
  | 'face-grin-beam-sweat'
  | 'face-grin-beam'
  | 'face-grin-hearts'
  | 'face-grin-squint-tears'
  | 'face-grin-squint'
  | 'face-grin-stars'
  | 'face-grin-tears'
  | 'face-grin-tongue-squint'
  | 'face-grin-tongue-wink'
  | 'face-grin-tongue'
  | 'face-grin-wide'
  | 'face-grin-wink'
  | 'face-grin'
  | 'face-hand-over-mouth'
  | 'face-hand-peeking'
  | 'face-hand-yawn'
  | 'face-head-bandage'
  | 'face-holding-back-tears'
  | 'face-hushed'
  | 'face-icicles'
  | 'face-kiss-beam'
  | 'face-kiss-closed-eyes'
  | 'face-kiss-wink-heart'
  | 'face-kiss'
  | 'face-laugh-beam'
  | 'face-laugh-squint'
  | 'face-laugh-wink'
  | 'face-laugh'
  | 'face-lying'
  | 'face-mask'
  | 'face-meh-blank'
  | 'face-meh'
  | 'face-melting'
  | 'face-monocle'
  | 'face-nauseated'
  | 'face-nose-steam'
  | 'face-party'
  | 'face-pensive'
  | 'face-persevering'
  | 'face-pleading'
  | 'face-pouting'
  | 'face-raised-eyebrow'
  | 'face-relieved'
  | 'face-rolling-eyes'
  | 'face-sad-cry'
  | 'face-sad-sweat'
  | 'face-sad-tear'
  | 'face-saluting'
  | 'face-scream'
  | 'face-shush'
  | 'face-sleeping'
  | 'face-sleepy'
  | 'face-smile-beam'
  | 'face-smile-halo'
  | 'face-smile-hearts'
  | 'face-smile-horns'
  | 'face-smile-plus'
  | 'face-smile-relaxed'
  | 'face-smile-tear'
  | 'face-smile-tongue'
  | 'face-smile-upside-down'
  | 'face-smile-wink'
  | 'face-smile'
  | 'face-smiling-hands'
  | 'face-smirking'
  | 'face-spiral-eyes'
  | 'face-sunglasses'
  | 'face-surprise'
  | 'face-swear'
  | 'face-thermometer'
  | 'face-thinking'
  | 'face-tired'
  | 'face-tissue'
  | 'face-tongue-money'
  | 'face-tongue-sweat'
  | 'face-unamused'
  | 'face-viewfinder'
  | 'face-vomit'
  | 'face-weary'
  | 'face-woozy'
  | 'face-worried'
  | 'face-zany'
  | 'face-zipper'
  | 'falafel'
  | 'family-dress'
  | 'family-pants'
  | 'family'
  | 'fan-table'
  | 'fan'
  | 'farm'
  | 'fast-backward'
  | 'fast-forward'
  | 'faucet-drip'
  | 'faucet'
  | 'fax'
  | 'feather-alt'
  | 'feather-pointed'
  | 'feather'
  | 'feed'
  | 'female'
  | 'fence'
  | 'ferris-wheel'
  | 'ferry'
  | 'field-hockey-stick-ball'
  | 'field-hockey'
  | 'fighter-jet'
  | 'file-alt'
  | 'file-archive'
  | 'file-arrow-down'
  | 'file-arrow-up'
  | 'file-audio'
  | 'file-award'
  | 'file-binary'
  | 'file-caret-down'
  | 'file-caret-up'
  | 'file-certificate'
  | 'file-chart-column'
  | 'file-chart-line'
  | 'file-chart-pie'
  | 'file-check'
  | 'file-circle-check'
  | 'file-circle-exclamation'
  | 'file-circle-info'
  | 'file-circle-minus'
  | 'file-circle-plus'
  | 'file-circle-question'
  | 'file-circle-xmark'
  | 'file-clipboard'
  | 'file-code'
  | 'file-contract'
  | 'file-csv'
  | 'file-dashed-line'
  | 'file-doc'
  | 'file-download'
  | 'file-edit'
  | 'file-excel'
  | 'file-exclamation'
  | 'file-export'
  | 'file-heart'
  | 'file-image'
  | 'file-import'
  | 'file-invoice-dollar'
  | 'file-invoice'
  | 'file-lines'
  | 'file-lock'
  | 'file-magnifying-glass'
  | 'file-medical-alt'
  | 'file-medical'
  | 'file-minus'
  | 'file-music'
  | 'file-pdf'
  | 'file-pen'
  | 'file-plus-minus'
  | 'file-plus'
  | 'file-powerpoint'
  | 'file-prescription'
  | 'file-search'
  | 'file-shield'
  | 'file-signature'
  | 'file-slash'
  | 'file-spreadsheet'
  | 'file-text'
  | 'file-times'
  | 'file-upload'
  | 'file-user'
  | 'file-video'
  | 'file-waveform'
  | 'file-word'
  | 'file-xmark'
  | 'file-zip'
  | 'file-zipper'
  | 'file'
  | 'files-medical'
  | 'files'
  | 'fill-drip'
  | 'fill'
  | 'film-alt'
  | 'film-canister'
  | 'film-cannister'
  | 'film-simple'
  | 'film-slash'
  | 'film'
  | 'films'
  | 'filter-circle-dollar'
  | 'filter-circle-xmark'
  | 'filter-list'
  | 'filter-slash'
  | 'filter'
  | 'filters'
  | 'fingerprint'
  | 'fire-alt'
  | 'fire-burner'
  | 'fire-extinguisher'
  | 'fire-flame-curved'
  | 'fire-flame-simple'
  | 'fire-flame'
  | 'fire-hydrant'
  | 'fire-smoke'
  | 'fire'
  | 'fireplace'
  | 'firewall'
  | 'first-aid'
  | 'fish-bones'
  | 'fish-cooked'
  | 'fish-fins'
  | 'fish'
  | 'fishing-rod'
  | 'fist-raised'
  | 'flag-alt'
  | 'flag-checkered'
  | 'flag-pennant'
  | 'flag-swallowtail'
  | 'flag-usa'
  | 'flag'
  | 'flame'
  | 'flashlight'
  | 'flask-gear'
  | 'flask-poison'
  | 'flask-potion'
  | 'flask-round-poison'
  | 'flask-round-potion'
  | 'flask-vial'
  | 'flask'
  | 'flatbread-stuffed'
  | 'flatbread'
  | 'floppy-disk-circle-arrow-right'
  | 'floppy-disk-circle-xmark'
  | 'floppy-disk-pen'
  | 'floppy-disk-times'
  | 'floppy-disk'
  | 'floppy-disks'
  | 'florin-sign'
  | 'flower-daffodil'
  | 'flower-tulip'
  | 'flower'
  | 'flushed'
  | 'flute'
  | 'flux-capacitor'
  | 'flying-disc'
  | 'fog'
  | 'folder-arrow-down'
  | 'folder-arrow-up'
  | 'folder-blank'
  | 'folder-bookmark'
  | 'folder-closed'
  | 'folder-cog'
  | 'folder-download'
  | 'folder-gear'
  | 'folder-grid'
  | 'folder-heart'
  | 'folder-image'
  | 'folder-magnifying-glass'
  | 'folder-medical'
  | 'folder-minus'
  | 'folder-music'
  | 'folder-open'
  | 'folder-plus'
  | 'folder-search'
  | 'folder-times'
  | 'folder-tree'
  | 'folder-upload'
  | 'folder-user'
  | 'folder-xmark'
  | 'folder'
  | 'folders'
  | 'fondue-pot'
  | 'font-awesome-flag'
  | 'font-awesome-logo-full'
  | 'font-awesome'
  | 'font-case'
  | 'font'
  | 'football-ball'
  | 'football-helmet'
  | 'football'
  | 'fork-knife'
  | 'fork'
  | 'forklift'
  | 'fort'
  | 'forward-fast'
  | 'forward-step'
  | 'forward'
  | 'fragile'
  | 'frame'
  | 'franc-sign'
  | 'french-fries'
  | 'frog'
  | 'frosty-head'
  | 'frown-open'
  | 'frown'
  | 'function'
  | 'funnel-dollar'
  | 'futbol-ball'
  | 'futbol'
  | 'g'
  | 'galaxy'
  | 'gallery-thumbnails'
  | 'game-board-alt'
  | 'game-board-simple'
  | 'game-board'
  | 'game-console-handheld-crank'
  | 'game-console-handheld'
  | 'gamepad-alt'
  | 'gamepad-modern'
  | 'gamepad'
  | 'garage-car'
  | 'garage-open'
  | 'garage'
  | 'garlic'
  | 'gas-pump-slash'
  | 'gas-pump'
  | 'gauge-circle-bolt'
  | 'gauge-circle-minus'
  | 'gauge-circle-plus'
  | 'gauge-high'
  | 'gauge-low'
  | 'gauge-max'
  | 'gauge-med'
  | 'gauge-min'
  | 'gauge-simple-high'
  | 'gauge-simple-low'
  | 'gauge-simple-max'
  | 'gauge-simple-med'
  | 'gauge-simple-min'
  | 'gauge-simple'
  | 'gauge'
  | 'gave-dandy'
  | 'gavel'
  | 'gbp'
  | 'gear-code'
  | 'gear-complex-code'
  | 'gear-complex'
  | 'gear'
  | 'gears'
  | 'gem'
  | 'genderless'
  | 'ghost'
  | 'gif'
  | 'gift-card'
  | 'gift'
  | 'gifts'
  | 'gingerbread-man'
  | 'glass-champagne'
  | 'glass-cheers'
  | 'glass-citrus'
  | 'glass-empty'
  | 'glass-half-empty'
  | 'glass-half-full'
  | 'glass-half'
  | 'glass-martini-alt'
  | 'glass-martini'
  | 'glass-water-droplet'
  | 'glass-water'
  | 'glass-whiskey-rocks'
  | 'glass-whiskey'
  | 'glass'
  | 'glasses-alt'
  | 'glasses-round'
  | 'glasses'
  | 'globe-africa'
  | 'globe-americas'
  | 'globe-asia'
  | 'globe-europe'
  | 'globe-oceania'
  | 'globe-snow'
  | 'globe-stand'
  | 'globe'
  | 'glove-boxing'
  | 'goal-net'
  | 'golf-ball-tee'
  | 'golf-ball'
  | 'golf-club'
  | 'golf-flag-hole'
  | 'gopuram'
  | 'graduation-cap'
  | 'gramophone'
  | 'grapes'
  | 'grate-droplet'
  | 'grate'
  | 'greater-than-equal'
  | 'greater-than'
  | 'grid-2-plus'
  | 'grid-2'
  | 'grid-3'
  | 'grid-4'
  | 'grid-5'
  | 'grid-dividers'
  | 'grid-horizontal'
  | 'grid-round-2-plus'
  | 'grid-round-2'
  | 'grid-round-4'
  | 'grid-round-5'
  | 'grid-round'
  | 'grid'
  | 'grill-fire'
  | 'grill-hot'
  | 'grill'
  | 'grimace'
  | 'grin-alt'
  | 'grin-beam-sweat'
  | 'grin-beam'
  | 'grin-hearts'
  | 'grin-squint-tears'
  | 'grin-squint'
  | 'grin-stars'
  | 'grin-tears'
  | 'grin-tongue-squint'
  | 'grin-tongue-wink'
  | 'grin-tongue'
  | 'grin-wink'
  | 'grin'
  | 'grip-dots-vertical'
  | 'grip-dots'
  | 'grip-horizontal'
  | 'grip-lines-vertical'
  | 'grip-lines'
  | 'grip-vertical'
  | 'grip'
  | 'group-arrows-rotate'
  | 'guarani-sign'
  | 'guitar-electric'
  | 'guitar'
  | 'guitars'
  | 'gun-slash'
  | 'gun-squirt'
  | 'gun'
  | 'h-square'
  | 'h'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hamburger'
  | 'hammer-crash'
  | 'hammer-war'
  | 'hammer'
  | 'hamsa'
  | 'hand-back-fist'
  | 'hand-back-point-down'
  | 'hand-back-point-left'
  | 'hand-back-point-ribbon'
  | 'hand-back-point-right'
  | 'hand-back-point-up'
  | 'hand-dots'
  | 'hand-fingers-crossed'
  | 'hand-fist'
  | 'hand-heart'
  | 'hand-holding-box'
  | 'hand-holding-dollar'
  | 'hand-holding-droplet'
  | 'hand-holding-hand'
  | 'hand-holding-heart'
  | 'hand-holding-magic'
  | 'hand-holding-medical'
  | 'hand-holding-seedling'
  | 'hand-holding-skull'
  | 'hand-holding-usd'
  | 'hand-holding-water'
  | 'hand-holding'
  | 'hand-horns'
  | 'hand-lizard'
  | 'hand-love'
  | 'hand-middle-finger'
  | 'hand-paper'
  | 'hand-peace'
  | 'hand-point-down'
  | 'hand-point-left'
  | 'hand-point-ribbon'
  | 'hand-point-right'
  | 'hand-point-up'
  | 'hand-pointer'
  | 'hand-receiving'
  | 'hand-rock'
  | 'hand-scissors'
  | 'hand-sparkles'
  | 'hand-spock'
  | 'hand-wave'
  | 'hand'
  | 'handcuffs'
  | 'hands-american-sign-language-interpreting'
  | 'hands-asl-interpreting'
  | 'hands-bound'
  | 'hands-bubbles'
  | 'hands-clapping'
  | 'hands-heart'
  | 'hands-helping'
  | 'hands-holding-child'
  | 'hands-holding-circle'
  | 'hands-holding-diamond'
  | 'hands-holding-dollar'
  | 'hands-holding-heart'
  | 'hands-holding'
  | 'hands-praying'
  | 'hands-usd'
  | 'hands-wash'
  | 'hands'
  | 'handshake-alt-slash'
  | 'handshake-alt'
  | 'handshake-angle'
  | 'handshake-simple-slash'
  | 'handshake-simple'
  | 'handshake-slash'
  | 'handshake'
  | 'hanukiah'
  | 'hard-drive'
  | 'hard-hat'
  | 'hard-of-hearing'
  | 'hashtag-lock'
  | 'hashtag'
  | 'hat-beach'
  | 'hat-chef'
  | 'hat-cowboy-side'
  | 'hat-cowboy'
  | 'hat-hard'
  | 'hat-santa'
  | 'hat-winter'
  | 'hat-witch'
  | 'hat-wizard'
  | 'haykal'
  | 'hdd'
  | 'head-side-brain'
  | 'head-side-cough-slash'
  | 'head-side-cough'
  | 'head-side-goggles'
  | 'head-side-headphones'
  | 'head-side-heart'
  | 'head-side-mask'
  | 'head-side-medical'
  | 'head-side-virus'
  | 'head-side'
  | 'head-vr'
  | 'header'
  | 'heading'
  | 'headphones-alt'
  | 'headphones-simple'
  | 'headphones'
  | 'headset'
  | 'heart-broken'
  | 'heart-circle-bolt'
  | 'heart-circle-check'
  | 'heart-circle-exclamation'
  | 'heart-circle-minus'
  | 'heart-circle-plus'
  | 'heart-circle-xmark'
  | 'heart-circle'
  | 'heart-crack'
  | 'heart-half-alt'
  | 'heart-half-stroke'
  | 'heart-half'
  | 'heart-music-camera-bolt'
  | 'heart-pulse'
  | 'heart-rate'
  | 'heart-square'
  | 'heart'
  | 'heartbeat'
  | 'heat'
  | 'helicopter-symbol'
  | 'helicopter'
  | 'helmet-battle'
  | 'helmet-safety'
  | 'helmet-un'
  | 'hexagon-check'
  | 'hexagon-divide'
  | 'hexagon-exclamation'
  | 'hexagon-image'
  | 'hexagon-minus'
  | 'hexagon-plus'
  | 'hexagon-vertical-nft-slanted'
  | 'hexagon-vertical-nft'
  | 'hexagon-xmark'
  | 'hexagon'
  | 'high-definition'
  | 'highlighter-line'
  | 'highlighter'
  | 'hiking'
  | 'hill-avalanche'
  | 'hill-rockslide'
  | 'hippo'
  | 'history'
  | 'hockey-mask'
  | 'hockey-puck'
  | 'hockey-stick-puck'
  | 'hockey-sticks'
  | 'holly-berry'
  | 'home-alt'
  | 'home-blank'
  | 'home-heart'
  | 'home-lg-alt'
  | 'home-lg'
  | 'home-user'
  | 'home'
  | 'honey-pot'
  | 'hood-cloak'
  | 'horizontal-rule'
  | 'horse-head'
  | 'horse-saddle'
  | 'horse'
  | 'hose-reel'
  | 'hose'
  | 'hospital-alt'
  | 'hospital-symbol'
  | 'hospital-user'
  | 'hospital-wide'
  | 'hospital'
  | 'hospitals'
  | 'hot-tub-person'
  | 'hot-tub'
  | 'hotdog'
  | 'hotel'
  | 'hourglass-1'
  | 'hourglass-2'
  | 'hourglass-3'
  | 'hourglass-clock'
  | 'hourglass-empty'
  | 'hourglass-end'
  | 'hourglass-half'
  | 'hourglass-start'
  | 'hourglass'
  | 'house-blank'
  | 'house-building'
  | 'house-chimney-blank'
  | 'house-chimney-crack'
  | 'house-chimney-heart'
  | 'house-chimney-medical'
  | 'house-chimney-user'
  | 'house-chimney-window'
  | 'house-chimney'
  | 'house-circle-check'
  | 'house-circle-exclamation'
  | 'house-circle-xmark'
  | 'house-crack'
  | 'house-damage'
  | 'house-day'
  | 'house-fire'
  | 'house-flag'
  | 'house-flood-water-circle-arrow-right'
  | 'house-flood-water'
  | 'house-flood'
  | 'house-heart'
  | 'house-laptop'
  | 'house-leave'
  | 'house-lock'
  | 'house-medical-circle-check'
  | 'house-medical-circle-exclamation'
  | 'house-medical-circle-xmark'
  | 'house-medical-flag'
  | 'house-medical'
  | 'house-night'
  | 'house-person-arrive'
  | 'house-person-depart'
  | 'house-person-leave'
  | 'house-person-return'
  | 'house-return'
  | 'house-signal'
  | 'house-tree'
  | 'house-tsunami'
  | 'house-turret'
  | 'house-user'
  | 'house-water'
  | 'house-window'
  | 'house'
  | 'hryvnia-sign'
  | 'hryvnia'
  | 'humidity'
  | 'hundred-points'
  | 'hurricane'
  | 'hyphen'
  | 'i-cursor'
  | 'i'
  | 'ice-cream'
  | 'ice-skate'
  | 'icicles'
  | 'icons-alt'
  | 'icons'
  | 'id-badge'
  | 'id-card-alt'
  | 'id-card-clip'
  | 'id-card'
  | 'igloo'
  | 'ils'
  | 'image-landscape'
  | 'image-polaroid-user'
  | 'image-polaroid'
  | 'image-portrait'
  | 'image-slash'
  | 'image-user'
  | 'image'
  | 'images-user'
  | 'images'
  | 'inbox-arrow-down'
  | 'inbox-arrow-up'
  | 'inbox-full'
  | 'inbox-in'
  | 'inbox-out'
  | 'inbox'
  | 'inboxes'
  | 'indent'
  | 'indian-rupee-sign'
  | 'indian-rupee'
  | 'industry-alt'
  | 'industry-windows'
  | 'industry'
  | 'infinity'
  | 'info-circle'
  | 'info-square'
  | 'info'
  | 'inhaler'
  | 'input-numeric'
  | 'input-pipe'
  | 'input-text'
  | 'inr'
  | 'institution'
  | 'integral'
  | 'interrobang'
  | 'intersection'
  | 'inventory'
  | 'island-tree-palm'
  | 'island-tropical'
  | 'italic'
  | 'j'
  | 'jack-o-lantern'
  | 'jar-wheat'
  | 'jar'
  | 'jedi'
  | 'jet-fighter-up'
  | 'jet-fighter'
  | 'joint'
  | 'journal-whills'
  | 'joystick'
  | 'jpy'
  | 'jug-bottle'
  | 'jug-detergent'
  | 'jug'
  | 'k'
  | 'kaaba'
  | 'kazoo'
  | 'kerning'
  | 'key-skeleton-left-right'
  | 'key-skeleton'
  | 'key'
  | 'keyboard-brightness-low'
  | 'keyboard-brightness'
  | 'keyboard-down'
  | 'keyboard-left'
  | 'keyboard'
  | 'keynote'
  | 'khanda'
  | 'kidneys'
  | 'kip-sign'
  | 'kiss-beam'
  | 'kiss-wink-heart'
  | 'kiss'
  | 'kit-medical'
  | 'kitchen-set'
  | 'kite'
  | 'kiwi-bird'
  | 'kiwi-fruit'
  | 'knife-kitchen'
  | 'knife'
  | 'krw'
  | 'l'
  | 'lacrosse-stick-ball'
  | 'lacrosse-stick'
  | 'ladder-water'
  | 'lambda'
  | 'lamp-desk'
  | 'lamp-floor'
  | 'lamp-street'
  | 'lamp'
  | 'land-mine-on'
  | 'landmark-alt'
  | 'landmark-dome'
  | 'landmark-flag'
  | 'landmark'
  | 'landscape'
  | 'language'
  | 'laptop-arrow-down'
  | 'laptop-binary'
  | 'laptop-code'
  | 'laptop-file'
  | 'laptop-house'
  | 'laptop-medical'
  | 'laptop-mobile'
  | 'laptop-slash'
  | 'laptop'
  | 'lari-sign'
  | 'lasso-sparkles'
  | 'lasso'
  | 'laugh-beam'
  | 'laugh-squint'
  | 'laugh-wink'
  | 'laugh'
  | 'layer-group-minus'
  | 'layer-group-plus'
  | 'layer-group'
  | 'layer-minus'
  | 'layer-plus'
  | 'leaf-heart'
  | 'leaf-maple'
  | 'leaf-oak'
  | 'leaf'
  | 'leafy-green'
  | 'left-from-line'
  | 'left-long-to-line'
  | 'left-long'
  | 'left-right'
  | 'left-to-line'
  | 'left'
  | 'legal'
  | 'lemon'
  | 'less-than-equal'
  | 'less-than'
  | 'level-down-alt'
  | 'level-down'
  | 'level-up-alt'
  | 'level-up'
  | 'life-ring'
  | 'light-ceiling'
  | 'light-emergency-on'
  | 'light-emergency'
  | 'light-switch-off'
  | 'light-switch-on'
  | 'light-switch'
  | 'lightbulb-cfl-on'
  | 'lightbulb-cfl'
  | 'lightbulb-dollar'
  | 'lightbulb-exclamation-on'
  | 'lightbulb-exclamation'
  | 'lightbulb-gear'
  | 'lightbulb-on'
  | 'lightbulb-slash'
  | 'lightbulb'
  | 'lights-holiday'
  | 'line-chart'
  | 'line-columns'
  | 'line-height'
  | 'lines-leaning'
  | 'link-horizontal-slash'
  | 'link-horizontal'
  | 'link-simple-slash'
  | 'link-simple'
  | 'link-slash'
  | 'link'
  | 'lips'
  | 'lira-sign'
  | 'list-1-2'
  | 'list-alt'
  | 'list-check'
  | 'list-dots'
  | 'list-dropdown'
  | 'list-music'
  | 'list-numeric'
  | 'list-ol'
  | 'list-radio'
  | 'list-squares'
  | 'list-timeline'
  | 'list-tree'
  | 'list-ul'
  | 'list'
  | 'litecoin-sign'
  | 'loader'
  | 'lobster'
  | 'location-arrow'
  | 'location-check'
  | 'location-circle'
  | 'location-crosshairs-slash'
  | 'location-crosshairs'
  | 'location-dot-slash'
  | 'location-dot'
  | 'location-exclamation'
  | 'location-minus'
  | 'location-pen'
  | 'location-pin-lock'
  | 'location-pin-slash'
  | 'location-pin'
  | 'location-plus'
  | 'location-question'
  | 'location-slash'
  | 'location-smile'
  | 'location-xmark'
  | 'location'
  | 'lock-a'
  | 'lock-alt'
  | 'lock-hashtag'
  | 'lock-keyhole-open'
  | 'lock-keyhole'
  | 'lock-open-alt'
  | 'lock-open'
  | 'lock'
  | 'locust'
  | 'lollipop'
  | 'lollypop'
  | 'long-arrow-alt-down'
  | 'long-arrow-alt-left'
  | 'long-arrow-alt-right'
  | 'long-arrow-alt-up'
  | 'long-arrow-down'
  | 'long-arrow-left'
  | 'long-arrow-right'
  | 'long-arrow-up'
  | 'loveseat'
  | 'low-vision'
  | 'luchador-mask'
  | 'luchador'
  | 'luggage-cart'
  | 'lungs-virus'
  | 'lungs'
  | 'm'
  | 'mace'
  | 'magic-wand-sparkles'
  | 'magic'
  | 'magnet'
  | 'magnifying-glass-arrow-right'
  | 'magnifying-glass-chart'
  | 'magnifying-glass-dollar'
  | 'magnifying-glass-location'
  | 'magnifying-glass-minus'
  | 'magnifying-glass-plus'
  | 'magnifying-glass'
  | 'mail-bulk'
  | 'mail-forward'
  | 'mail-reply-all'
  | 'mail-reply'
  | 'mailbox-flag-up'
  | 'mailbox'
  | 'maki-roll'
  | 'makizushi'
  | 'male'
  | 'manat-sign'
  | 'mandolin'
  | 'mango'
  | 'manhole'
  | 'map-location-dot'
  | 'map-location'
  | 'map-marked-alt'
  | 'map-marked'
  | 'map-marker-alt-slash'
  | 'map-marker-alt'
  | 'map-marker-check'
  | 'map-marker-edit'
  | 'map-marker-exclamation'
  | 'map-marker-minus'
  | 'map-marker-plus'
  | 'map-marker-question'
  | 'map-marker-slash'
  | 'map-marker-smile'
  | 'map-marker-times'
  | 'map-marker-xmark'
  | 'map-marker'
  | 'map-pin'
  | 'map-signs'
  | 'map'
  | 'marker'
  | 'mars-and-venus-burst'
  | 'mars-and-venus'
  | 'mars-double'
  | 'mars-stroke-h'
  | 'mars-stroke-right'
  | 'mars-stroke-up'
  | 'mars-stroke-v'
  | 'mars-stroke'
  | 'mars'
  | 'martini-glass-citrus'
  | 'martini-glass-empty'
  | 'martini-glass'
  | 'mask-face'
  | 'mask-luchador'
  | 'mask-snorkel'
  | 'mask-ventilator'
  | 'mask'
  | 'masks-theater'
  | 'mattress-pillow'
  | 'maximize'
  | 'meat'
  | 'medal'
  | 'medkit'
  | 'megaphone'
  | 'meh-blank'
  | 'meh-rolling-eyes'
  | 'meh'
  | 'melon-slice'
  | 'melon'
  | 'memo-circle-check'
  | 'memo-circle-info'
  | 'memo-pad'
  | 'memo'
  | 'memory'
  | 'menorah'
  | 'mercury'
  | 'merge'
  | 'message-arrow-down'
  | 'message-arrow-up-right'
  | 'message-arrow-up'
  | 'message-bot'
  | 'message-captions'
  | 'message-check'
  | 'message-code'
  | 'message-dollar'
  | 'message-dots'
  | 'message-edit'
  | 'message-exclamation'
  | 'message-heart'
  | 'message-image'
  | 'message-lines'
  | 'message-medical'
  | 'message-middle-top'
  | 'message-middle'
  | 'message-minus'
  | 'message-music'
  | 'message-pen'
  | 'message-plus'
  | 'message-question'
  | 'message-quote'
  | 'message-slash'
  | 'message-smile'
  | 'message-sms'
  | 'message-text'
  | 'message-times'
  | 'message-xmark'
  | 'message'
  | 'messages-dollar'
  | 'messages-question'
  | 'messages'
  | 'messaging'
  | 'meteor'
  | 'meter-bolt'
  | 'meter-droplet'
  | 'meter-fire'
  | 'meter'
  | 'microchip-ai'
  | 'microchip'
  | 'microphone-alt-slash'
  | 'microphone-alt'
  | 'microphone-circle-alt'
  | 'microphone-circle'
  | 'microphone-lines-slash'
  | 'microphone-lines'
  | 'microphone-slash'
  | 'microphone-stand'
  | 'microphone'
  | 'microscope'
  | 'microwave'
  | 'mill-sign'
  | 'mind-share'
  | 'minimize'
  | 'minus-circle'
  | 'minus-hexagon'
  | 'minus-large'
  | 'minus-octagon'
  | 'minus-square'
  | 'minus'
  | 'mistletoe'
  | 'mitten'
  | 'mobile-alt'
  | 'mobile-android-alt'
  | 'mobile-android'
  | 'mobile-button'
  | 'mobile-iphone'
  | 'mobile-notch'
  | 'mobile-phone'
  | 'mobile-retro'
  | 'mobile-screen-button'
  | 'mobile-screen'
  | 'mobile-signal-out'
  | 'mobile-signal'
  | 'mobile'
  | 'money-bill-1-wave'
  | 'money-bill-1'
  | 'money-bill-alt'
  | 'money-bill-simple-wave'
  | 'money-bill-simple'
  | 'money-bill-transfer'
  | 'money-bill-trend-up'
  | 'money-bill-wave-alt'
  | 'money-bill-wave'
  | 'money-bill-wheat'
  | 'money-bill'
  | 'money-bills-alt'
  | 'money-bills-simple'
  | 'money-bills'
  | 'money-check-alt'
  | 'money-check-dollar-pen'
  | 'money-check-dollar'
  | 'money-check-edit-alt'
  | 'money-check-edit'
  | 'money-check-pen'
  | 'money-check'
  | 'money-from-bracket'
  | 'money-simple-from-bracket'
  | 'monitor-heart-rate'
  | 'monitor-waveform'
  | 'monkey'
  | 'monument'
  | 'moon-cloud'
  | 'moon-over-sun'
  | 'moon-stars'
  | 'moon'
  | 'moped'
  | 'mortar-board'
  | 'mortar-pestle'
  | 'mosque'
  | 'mosquito-net'
  | 'mosquito'
  | 'motorcycle'
  | 'mound'
  | 'mountain-city'
  | 'mountain-sun'
  | 'mountain'
  | 'mountains'
  | 'mouse-alt'
  | 'mouse-field'
  | 'mouse-pointer'
  | 'mouse'
  | 'mp3-player'
  | 'mug-hot'
  | 'mug-marshmallows'
  | 'mug-saucer'
  | 'mug-tea-saucer'
  | 'mug-tea'
  | 'mug'
  | 'multiply'
  | 'museum'
  | 'mushroom'
  | 'music-alt-slash'
  | 'music-alt'
  | 'music-note-slash'
  | 'music-note'
  | 'music-slash'
  | 'music'
  | 'mustache'
  | 'n'
  | 'naira-sign'
  | 'narwhal'
  | 'navicon'
  | 'nesting-dolls'
  | 'network-wired'
  | 'neuter'
  | 'newspaper'
  | 'nfc-lock'
  | 'nfc-magnifying-glass'
  | 'nfc-pen'
  | 'nfc-signal'
  | 'nfc-slash'
  | 'nfc-symbol'
  | 'nfc-trash'
  | 'nfc'
  | 'nigiri'
  | 'nose'
  | 'not-equal'
  | 'notdef'
  | 'note-medical'
  | 'note-sticky'
  | 'note'
  | 'notebook'
  | 'notes-medical'
  | 'notes'
  | 'o'
  | 'object-exclude'
  | 'object-group'
  | 'object-intersect'
  | 'object-subtract'
  | 'object-ungroup'
  | 'object-union'
  | 'objects-align-bottom'
  | 'objects-align-center-horizontal'
  | 'objects-align-center-vertical'
  | 'objects-align-left'
  | 'objects-align-right'
  | 'objects-align-top'
  | 'objects-column'
  | 'octagon-check'
  | 'octagon-divide'
  | 'octagon-exclamation'
  | 'octagon-minus'
  | 'octagon-plus'
  | 'octagon-xmark'
  | 'octagon'
  | 'oil-can-drip'
  | 'oil-can'
  | 'oil-temp'
  | 'oil-temperature'
  | 'oil-well'
  | 'olive-branch'
  | 'olive'
  | 'om'
  | 'omega'
  | 'onion'
  | 'option'
  | 'ornament'
  | 'otter'
  | 'outdent'
  | 'outlet'
  | 'oven'
  | 'overline'
  | 'p'
  | 'page-break'
  | 'page-caret-down'
  | 'page-caret-up'
  | 'page'
  | 'pager'
  | 'paint-brush-alt'
  | 'paint-brush-fine'
  | 'paint-brush'
  | 'paint-roller'
  | 'paintbrush-alt'
  | 'paintbrush-fine'
  | 'paintbrush-pencil'
  | 'paintbrush'
  | 'palette-boxes'
  | 'palette'
  | 'pallet-alt'
  | 'pallet-box'
  | 'pallet-boxes'
  | 'pallet'
  | 'pan-food'
  | 'pan-frying'
  | 'pancakes'
  | 'panel-ews'
  | 'panel-fire'
  | 'panorama'
  | 'paper-plane-alt'
  | 'paper-plane-top'
  | 'paper-plane'
  | 'paperclip-vertical'
  | 'paperclip'
  | 'parachute-box'
  | 'paragraph-left'
  | 'paragraph-rtl'
  | 'paragraph'
  | 'parentheses'
  | 'parenthesis'
  | 'parking-circle-slash'
  | 'parking-circle'
  | 'parking-slash'
  | 'parking'
  | 'party-back'
  | 'party-bell'
  | 'party-horn'
  | 'passport'
  | 'pastafarianism'
  | 'paste'
  | 'pause-circle'
  | 'pause'
  | 'paw-alt'
  | 'paw-claws'
  | 'paw-simple'
  | 'paw'
  | 'peace'
  | 'peach'
  | 'peanut'
  | 'peanuts'
  | 'peapod'
  | 'pear'
  | 'pedestal'
  | 'pegasus'
  | 'pen-alt-slash'
  | 'pen-alt'
  | 'pen-circle'
  | 'pen-clip-slash'
  | 'pen-clip'
  | 'pen-fancy-slash'
  | 'pen-fancy'
  | 'pen-field'
  | 'pen-line'
  | 'pen-nib-slash'
  | 'pen-nib'
  | 'pen-paintbrush'
  | 'pen-ruler'
  | 'pen-slash'
  | 'pen-square'
  | 'pen-swirl'
  | 'pen-to-square'
  | 'pen'
  | 'pencil-alt'
  | 'pencil-mechanical'
  | 'pencil-paintbrush'
  | 'pencil-ruler'
  | 'pencil-slash'
  | 'pencil-square'
  | 'pencil'
  | 'pennant'
  | 'people-arrows-left-right'
  | 'people-arrows'
  | 'people-carry-box'
  | 'people-carry'
  | 'people-dress-simple'
  | 'people-dress'
  | 'people-group'
  | 'people-line'
  | 'people-pants-simple'
  | 'people-pants'
  | 'people-pulling'
  | 'people-robbery'
  | 'people-roof'
  | 'people-simple'
  | 'people'
  | 'pepper-hot'
  | 'pepper'
  | 'percent'
  | 'percentage'
  | 'period'
  | 'person-arrow-down-to-line'
  | 'person-arrow-up-from-line'
  | 'person-biking-mountain'
  | 'person-biking'
  | 'person-booth'
  | 'person-breastfeeding'
  | 'person-burst'
  | 'person-cane'
  | 'person-carry-box'
  | 'person-carry'
  | 'person-chalkboard'
  | 'person-circle-check'
  | 'person-circle-exclamation'
  | 'person-circle-minus'
  | 'person-circle-plus'
  | 'person-circle-question'
  | 'person-circle-xmark'
  | 'person-digging'
  | 'person-dolly-empty'
  | 'person-dolly'
  | 'person-dots-from-line'
  | 'person-dress-burst'
  | 'person-dress-simple'
  | 'person-dress'
  | 'person-drowning'
  | 'person-falling-burst'
  | 'person-falling'
  | 'person-from-portal'
  | 'person-half-dress'
  | 'person-harassing'
  | 'person-hiking'
  | 'person-military-pointing'
  | 'person-military-rifle'
  | 'person-military-to-person'
  | 'person-pinball'
  | 'person-praying'
  | 'person-pregnant'
  | 'person-rays'
  | 'person-rifle'
  | 'person-running-fast'
  | 'person-running'
  | 'person-seat-reclined'
  | 'person-seat'
  | 'person-shelter'
  | 'person-sign'
  | 'person-simple'
  | 'person-skating'
  | 'person-ski-jumping'
  | 'person-ski-lift'
  | 'person-skiing-nordic'
  | 'person-skiing'
  | 'person-sledding'
  | 'person-snowboarding'
  | 'person-snowmobiling'
  | 'person-swimming'
  | 'person-through-window'
  | 'person-to-door'
  | 'person-to-portal'
  | 'person-walking-arrow-loop-left'
  | 'person-walking-arrow-right'
  | 'person-walking-dashed-line-arrow-right'
  | 'person-walking-luggage'
  | 'person-walking-with-cane'
  | 'person-walking'
  | 'person'
  | 'peseta-sign'
  | 'peso-sign'
  | 'phone-alt'
  | 'phone-arrow-down-left'
  | 'phone-arrow-down'
  | 'phone-arrow-right'
  | 'phone-arrow-up-right'
  | 'phone-arrow-up'
  | 'phone-circle-alt'
  | 'phone-circle-down'
  | 'phone-circle'
  | 'phone-flip'
  | 'phone-hangup'
  | 'phone-incoming'
  | 'phone-intercom'
  | 'phone-laptop'
  | 'phone-missed'
  | 'phone-office'
  | 'phone-outgoing'
  | 'phone-plus'
  | 'phone-rotary'
  | 'phone-slash'
  | 'phone-square-alt'
  | 'phone-square-down'
  | 'phone-square'
  | 'phone-volume'
  | 'phone-xmark'
  | 'phone'
  | 'photo-film-music'
  | 'photo-film'
  | 'photo-video'
  | 'pi'
  | 'piano-keyboard'
  | 'piano'
  | 'pickaxe'
  | 'pickleball'
  | 'pie-chart'
  | 'pie'
  | 'pig'
  | 'piggy-bank'
  | 'pills'
  | 'pinata'
  | 'pinball'
  | 'pineapple'
  | 'ping-pong-paddle-ball'
  | 'pipe-circle-check'
  | 'pipe-collar'
  | 'pipe-section'
  | 'pipe-smoking'
  | 'pipe-valve'
  | 'pipe'
  | 'pizza-slice'
  | 'pizza'
  | 'place-of-worship'
  | 'plane-alt'
  | 'plane-arrival'
  | 'plane-circle-check'
  | 'plane-circle-exclamation'
  | 'plane-circle-xmark'
  | 'plane-departure'
  | 'plane-engines'
  | 'plane-lock'
  | 'plane-prop'
  | 'plane-slash'
  | 'plane-tail'
  | 'plane-up-slash'
  | 'plane-up'
  | 'plane'
  | 'planet-moon'
  | 'planet-ringed'
  | 'plant-wilt'
  | 'plate-utensils'
  | 'plate-wheat'
  | 'play-circle'
  | 'play-pause'
  | 'play'
  | 'plug-circle-bolt'
  | 'plug-circle-check'
  | 'plug-circle-exclamation'
  | 'plug-circle-minus'
  | 'plug-circle-plus'
  | 'plug-circle-xmark'
  | 'plug'
  | 'plus-circle'
  | 'plus-hexagon'
  | 'plus-large'
  | 'plus-minus'
  | 'plus-octagon'
  | 'plus-square'
  | 'plus'
  | 'podcast'
  | 'podium-star'
  | 'podium'
  | 'police-box'
  | 'poll-h'
  | 'poll-people'
  | 'poll'
  | 'pompebled'
  | 'poo-bolt'
  | 'poo-storm'
  | 'poo'
  | 'pool-8-ball'
  | 'poop'
  | 'popcorn'
  | 'popsicle'
  | 'portal-enter'
  | 'portal-exit'
  | 'portrait'
  | 'pot-food'
  | 'potato'
  | 'pound-sign'
  | 'power-off'
  | 'pray'
  | 'praying-hands'
  | 'prescription-bottle-alt'
  | 'prescription-bottle-medical'
  | 'prescription-bottle-pill'
  | 'prescription-bottle'
  | 'prescription'
  | 'presentation-screen'
  | 'presentation'
  | 'pretzel'
  | 'print-magnifying-glass'
  | 'print-search'
  | 'print-slash'
  | 'print'
  | 'pro'
  | 'procedures'
  | 'project-diagram'
  | 'projector'
  | 'pump-medical'
  | 'pump-soap'
  | 'pump'
  | 'pumpkin'
  | 'puzzle-piece-alt'
  | 'puzzle-piece-simple'
  | 'puzzle-piece'
  | 'puzzle'
  | 'q'
  | 'qrcode'
  | 'question-circle'
  | 'question-square'
  | 'question'
  | 'quidditch-broom-ball'
  | 'quidditch'
  | 'quote-left-alt'
  | 'quote-left'
  | 'quote-right-alt'
  | 'quote-right'
  | 'quotes'
  | 'quran'
  | 'r'
  | 'rabbit-fast'
  | 'rabbit-running'
  | 'rabbit'
  | 'racquet'
  | 'radar'
  | 'radiation-alt'
  | 'radiation'
  | 'radio-alt'
  | 'radio-tuner'
  | 'radio'
  | 'rainbow'
  | 'raindrops'
  | 'ram'
  | 'ramp-loading'
  | 'random'
  | 'ranking-star'
  | 'raygun'
  | 'receipt'
  | 'record-vinyl'
  | 'rectangle-ad'
  | 'rectangle-barcode'
  | 'rectangle-code'
  | 'rectangle-hd'
  | 'rectangle-history-circle-plus'
  | 'rectangle-history-circle-user'
  | 'rectangle-history'
  | 'rectangle-landscape'
  | 'rectangle-list'
  | 'rectangle-portrait'
  | 'rectangle-pro'
  | 'rectangle-sd'
  | 'rectangle-terminal'
  | 'rectangle-times'
  | 'rectangle-vertical-history'
  | 'rectangle-vertical'
  | 'rectangle-wide'
  | 'rectangle-xmark'
  | 'rectangle'
  | 'rectangles-mixed'
  | 'recycle'
  | 'redo-alt'
  | 'redo'
  | 'reel'
  | 'refresh'
  | 'refrigerator'
  | 'registered'
  | 'remove-format'
  | 'remove'
  | 'reorder'
  | 'repeat-1-alt'
  | 'repeat-1'
  | 'repeat-alt'
  | 'repeat'
  | 'reply-all'
  | 'reply-clock'
  | 'reply-time'
  | 'reply'
  | 'republican'
  | 'restroom-simple'
  | 'restroom'
  | 'retweet-alt'
  | 'retweet'
  | 'rhombus'
  | 'ribbon'
  | 'right-from-bracket'
  | 'right-from-line'
  | 'right-left-large'
  | 'right-left'
  | 'right-long-to-line'
  | 'right-long'
  | 'right-to-bracket'
  | 'right-to-line'
  | 'right'
  | 'ring-diamond'
  | 'ring'
  | 'rings-wedding'
  | 'rmb'
  | 'road-barrier'
  | 'road-bridge'
  | 'road-circle-check'
  | 'road-circle-exclamation'
  | 'road-circle-xmark'
  | 'road-lock'
  | 'road-spikes'
  | 'road'
  | 'robot-astromech'
  | 'robot'
  | 'rocket-launch'
  | 'rocket'
  | 'rod-asclepius'
  | 'rod-snake'
  | 'roller-coaster'
  | 'rotate-back'
  | 'rotate-backward'
  | 'rotate-exclamation'
  | 'rotate-forward'
  | 'rotate-left'
  | 'rotate-right'
  | 'rotate'
  | 'rouble'
  | 'route-highway'
  | 'route-interstate'
  | 'route'
  | 'router'
  | 'rows'
  | 'rss-square'
  | 'rss'
  | 'rub'
  | 'ruble-sign'
  | 'ruble'
  | 'rug'
  | 'rugby-ball'
  | 'ruler-combined'
  | 'ruler-horizontal'
  | 'ruler-triangle'
  | 'ruler-vertical'
  | 'ruler'
  | 'running'
  | 'rupee-sign'
  | 'rupee'
  | 'rupiah-sign'
  | 'rv'
  | 's'
  | 'sack-dollar'
  | 'sack-xmark'
  | 'sack'
  | 'sad-cry'
  | 'sad-tear'
  | 'sailboat'
  | 'salad'
  | 'salt-shaker'
  | 'sandwich'
  | 'satellite-dish'
  | 'satellite'
  | 'sausage'
  | 'save-circle-arrow-right'
  | 'save-circle-xmark'
  | 'save-times'
  | 'save'
  | 'sax-hot'
  | 'saxophone-fire'
  | 'saxophone'
  | 'scale-balanced'
  | 'scale-unbalanced-flip'
  | 'scale-unbalanced'
  | 'scalpel-line-dashed'
  | 'scalpel-path'
  | 'scalpel'
  | 'scanner-gun'
  | 'scanner-image'
  | 'scanner-keyboard'
  | 'scanner-touchscreen'
  | 'scanner'
  | 'scarecrow'
  | 'scarf'
  | 'school-circle-check'
  | 'school-circle-exclamation'
  | 'school-circle-xmark'
  | 'school-flag'
  | 'school-lock'
  | 'school'
  | 'scissors'
  | 'screen-users'
  | 'screencast'
  | 'screenshot'
  | 'screwdriver-wrench'
  | 'screwdriver'
  | 'scribble'
  | 'scroll-old'
  | 'scroll-ribbon'
  | 'scroll-torah'
  | 'scroll'
  | 'scrubber'
  | 'scythe'
  | 'sd-card'
  | 'sd-cards'
  | 'seal-exclamation'
  | 'seal-question'
  | 'seal'
  | 'search-dollar'
  | 'search-location'
  | 'search-minus'
  | 'search-plus'
  | 'search'
  | 'seat-airline'
  | 'section'
  | 'seedling'
  | 'semicolon'
  | 'send-back'
  | 'send-backward'
  | 'send'
  | 'sensor-alert'
  | 'sensor-cloud'
  | 'sensor-fire'
  | 'sensor-on'
  | 'sensor-smoke'
  | 'sensor-triangle-exclamation'
  | 'sensor'
  | 'server'
  | 'shapes'
  | 'share-all'
  | 'share-alt-square'
  | 'share-alt'
  | 'share-from-square'
  | 'share-nodes'
  | 'share-square'
  | 'share'
  | 'sheep'
  | 'sheet-plastic'
  | 'shekel-sign'
  | 'shekel'
  | 'shelves-empty'
  | 'shelves'
  | 'sheqel-sign'
  | 'sheqel'
  | 'shield-alt'
  | 'shield-blank'
  | 'shield-cat'
  | 'shield-check'
  | 'shield-cross'
  | 'shield-dog'
  | 'shield-exclamation'
  | 'shield-halved'
  | 'shield-heart'
  | 'shield-keyhole'
  | 'shield-minus'
  | 'shield-plus'
  | 'shield-quartered'
  | 'shield-slash'
  | 'shield-times'
  | 'shield-virus'
  | 'shield-xmark'
  | 'shield'
  | 'ship'
  | 'shipping-fast'
  | 'shipping-timed'
  | 'shirt-long-sleeve'
  | 'shirt-running'
  | 'shirt-tank-top'
  | 'shirt'
  | 'shish-kebab'
  | 'shoe-prints'
  | 'shop-lock'
  | 'shop-slash'
  | 'shop'
  | 'shopping-bag'
  | 'shopping-basket-alt'
  | 'shopping-basket'
  | 'shopping-cart'
  | 'shortcake'
  | 'shovel-snow'
  | 'shovel'
  | 'shower-alt'
  | 'shower-down'
  | 'shower'
  | 'shredder'
  | 'shrimp'
  | 'shuffle'
  | 'shutters'
  | 'shuttle-space'
  | 'shuttle-van'
  | 'shuttlecock'
  | 'sickle'
  | 'sidebar-flip'
  | 'sidebar'
  | 'sigma'
  | 'sign-hanging'
  | 'sign-in-alt'
  | 'sign-in'
  | 'sign-language'
  | 'sign-out-alt'
  | 'sign-out'
  | 'sign'
  | 'signal-1'
  | 'signal-2'
  | 'signal-3'
  | 'signal-4'
  | 'signal-5'
  | 'signal-alt-1'
  | 'signal-alt-2'
  | 'signal-alt-3'
  | 'signal-alt-4'
  | 'signal-alt-slash'
  | 'signal-alt'
  | 'signal-bars-fair'
  | 'signal-bars-good'
  | 'signal-bars-slash'
  | 'signal-bars-strong'
  | 'signal-bars-weak'
  | 'signal-bars'
  | 'signal-fair'
  | 'signal-good'
  | 'signal-perfect'
  | 'signal-slash'
  | 'signal-stream-slash'
  | 'signal-stream'
  | 'signal-strong'
  | 'signal-weak'
  | 'signal'
  | 'signature-lock'
  | 'signature-slash'
  | 'signature'
  | 'signing'
  | 'signs-post'
  | 'sim-card'
  | 'sim-cards'
  | 'sink'
  | 'siren-on'
  | 'siren'
  | 'sitemap'
  | 'skating'
  | 'skeleton-ribs'
  | 'skeleton'
  | 'ski-boot-ski'
  | 'ski-boot'
  | 'ski-jump'
  | 'ski-lift'
  | 'skiing-nordic'
  | 'skiing'
  | 'skull-cow'
  | 'skull-crossbones'
  | 'skull'
  | 'slash-back'
  | 'slash-forward'
  | 'slash'
  | 'sledding'
  | 'sleigh'
  | 'slider'
  | 'sliders-h-square'
  | 'sliders-h'
  | 'sliders-simple'
  | 'sliders-up'
  | 'sliders-v-square'
  | 'sliders-v'
  | 'sliders'
  | 'slot-machine'
  | 'smile-beam'
  | 'smile-plus'
  | 'smile-wink'
  | 'smile'
  | 'smog'
  | 'smoke'
  | 'smoking-ban'
  | 'smoking'
  | 'sms'
  | 'snake'
  | 'snooze'
  | 'snow-blowing'
  | 'snowboarding'
  | 'snowflake-droplets'
  | 'snowflake'
  | 'snowflakes'
  | 'snowman-head'
  | 'snowman'
  | 'snowmobile'
  | 'snowplow'
  | 'soap'
  | 'soccer-ball'
  | 'socks'
  | 'soft-serve'
  | 'solar-panel'
  | 'solar-system'
  | 'sort-alpha-asc'
  | 'sort-alpha-desc'
  | 'sort-alpha-down-alt'
  | 'sort-alpha-down'
  | 'sort-alpha-up-alt'
  | 'sort-alpha-up'
  | 'sort-alt'
  | 'sort-amount-asc'
  | 'sort-amount-desc'
  | 'sort-amount-down-alt'
  | 'sort-amount-down'
  | 'sort-amount-up-alt'
  | 'sort-amount-up'
  | 'sort-asc'
  | 'sort-circle-down'
  | 'sort-circle-up'
  | 'sort-circle'
  | 'sort-desc'
  | 'sort-down'
  | 'sort-numeric-asc'
  | 'sort-numeric-desc'
  | 'sort-numeric-down-alt'
  | 'sort-numeric-down'
  | 'sort-numeric-up-alt'
  | 'sort-numeric-up'
  | 'sort-shapes-down-alt'
  | 'sort-shapes-down'
  | 'sort-shapes-up-alt'
  | 'sort-shapes-up'
  | 'sort-size-down-alt'
  | 'sort-size-down'
  | 'sort-size-up-alt'
  | 'sort-size-up'
  | 'sort-up-down'
  | 'sort-up'
  | 'sort'
  | 'soup'
  | 'spa'
  | 'space-shuttle'
  | 'space-station-moon-alt'
  | 'space-station-moon-construction'
  | 'space-station-moon'
  | 'spade'
  | 'spaghetti-monster-flying'
  | 'sparkle'
  | 'sparkles'
  | 'speaker'
  | 'speakers'
  | 'spell-check'
  | 'spider-black-widow'
  | 'spider-web'
  | 'spider'
  | 'spinner-third'
  | 'spinner'
  | 'split'
  | 'splotch'
  | 'spoon'
  | 'sportsball'
  | 'spray-can-sparkles'
  | 'spray-can'
  | 'sprinkler-ceiling'
  | 'sprinkler'
  | 'sprout'
  | 'square-0'
  | 'square-1'
  | 'square-2'
  | 'square-3'
  | 'square-4'
  | 'square-5'
  | 'square-6'
  | 'square-7'
  | 'square-8'
  | 'square-9'
  | 'square-a-lock'
  | 'square-a'
  | 'square-ampersand'
  | 'square-arrow-down-left'
  | 'square-arrow-down-right'
  | 'square-arrow-down'
  | 'square-arrow-left'
  | 'square-arrow-right'
  | 'square-arrow-up-left'
  | 'square-arrow-up-right'
  | 'square-arrow-up'
  | 'square-b'
  | 'square-bolt'
  | 'square-c'
  | 'square-caret-down'
  | 'square-caret-left'
  | 'square-caret-right'
  | 'square-caret-up'
  | 'square-check'
  | 'square-chevron-down'
  | 'square-chevron-left'
  | 'square-chevron-right'
  | 'square-chevron-up'
  | 'square-code'
  | 'square-d'
  | 'square-dashed-circle-plus'
  | 'square-dashed'
  | 'square-divide'
  | 'square-dollar'
  | 'square-down-left'
  | 'square-down-right'
  | 'square-down'
  | 'square-e'
  | 'square-ellipsis-vertical'
  | 'square-ellipsis'
  | 'square-envelope'
  | 'square-exclamation'
  | 'square-f'
  | 'square-fragile'
  | 'square-full'
  | 'square-g'
  | 'square-h'
  | 'square-heart'
  | 'square-i'
  | 'square-info'
  | 'square-j'
  | 'square-k'
  | 'square-kanban'
  | 'square-l'
  | 'square-left'
  | 'square-list'
  | 'square-m'
  | 'square-minus'
  | 'square-n'
  | 'square-nfi'
  | 'square-o'
  | 'square-p'
  | 'square-parking-slash'
  | 'square-parking'
  | 'square-pen'
  | 'square-person-confined'
  | 'square-phone-flip'
  | 'square-phone-hangup'
  | 'square-phone'
  | 'square-plus'
  | 'square-poll-horizontal'
  | 'square-poll-vertical'
  | 'square-q'
  | 'square-quarters'
  | 'square-question'
  | 'square-quote'
  | 'square-r'
  | 'square-right'
  | 'square-ring'
  | 'square-root-alt'
  | 'square-root-variable'
  | 'square-root'
  | 'square-rss'
  | 'square-s'
  | 'square-share-nodes'
  | 'square-sliders-vertical'
  | 'square-sliders'
  | 'square-small'
  | 'square-star'
  | 'square-t'
  | 'square-terminal'
  | 'square-this-way-up'
  | 'square-u'
  | 'square-up-left'
  | 'square-up-right'
  | 'square-up'
  | 'square-user'
  | 'square-v'
  | 'square-virus'
  | 'square-w'
  | 'square-wine-glass-crack'
  | 'square-x'
  | 'square-xmark'
  | 'square-y'
  | 'square-z'
  | 'square'
  | 'squid'
  | 'squirrel'
  | 'staff-aesculapius'
  | 'staff-snake'
  | 'staff'
  | 'stairs'
  | 'stamp'
  | 'standard-definition'
  | 'stapler'
  | 'star-and-crescent'
  | 'star-christmas'
  | 'star-circle'
  | 'star-exclamation'
  | 'star-half-alt'
  | 'star-half-stroke'
  | 'star-half'
  | 'star-of-david'
  | 'star-of-life'
  | 'star-sharp-half-alt'
  | 'star-sharp-half-stroke'
  | 'star-sharp-half'
  | 'star-sharp'
  | 'star-shooting'
  | 'star'
  | 'starfighter-alt-advanced'
  | 'starfighter-alt'
  | 'starfighter-twin-ion-engine-advanced'
  | 'starfighter-twin-ion-engine'
  | 'starfighter'
  | 'stars'
  | 'starship-freighter'
  | 'starship'
  | 'steak'
  | 'steering-wheel'
  | 'step-backward'
  | 'step-forward'
  | 'sterling-sign'
  | 'stethoscope'
  | 'sticky-note'
  | 'stocking'
  | 'stomach'
  | 'stop-circle'
  | 'stop'
  | 'stopwatch-20'
  | 'stopwatch'
  | 'store-alt-slash'
  | 'store-alt'
  | 'store-lock'
  | 'store-slash'
  | 'store'
  | 'strawberry'
  | 'stream'
  | 'street-view'
  | 'stretcher'
  | 'strikethrough'
  | 'stroopwafel'
  | 'subscript'
  | 'subtract'
  | 'subway-tunnel'
  | 'subway'
  | 'suitcase-medical'
  | 'suitcase-rolling'
  | 'suitcase'
  | 'sun-alt'
  | 'sun-bright'
  | 'sun-cloud'
  | 'sun-dust'
  | 'sun-haze'
  | 'sun-plant-wilt'
  | 'sun'
  | 'sunglasses'
  | 'sunrise'
  | 'sunset'
  | 'superscript'
  | 'surprise'
  | 'sushi-roll'
  | 'sushi'
  | 'swatchbook'
  | 'swimmer'
  | 'swimming-pool'
  | 'sword-laser-alt'
  | 'sword-laser'
  | 'sword'
  | 'swords-laser'
  | 'swords'
  | 'symbols'
  | 'synagogue'
  | 'sync-alt'
  | 'sync'
  | 'syringe'
  | 't-shirt'
  | 't'
  | 'table-cells-large'
  | 'table-cells'
  | 'table-columns'
  | 'table-layout'
  | 'table-list'
  | 'table-picnic'
  | 'table-pivot'
  | 'table-rows'
  | 'table-tennis-paddle-ball'
  | 'table-tennis'
  | 'table-tree'
  | 'table'
  | 'tablet-alt'
  | 'tablet-android-alt'
  | 'tablet-android'
  | 'tablet-button'
  | 'tablet-rugged'
  | 'tablet-screen-button'
  | 'tablet-screen'
  | 'tablet'
  | 'tablets'
  | 'tachograph-digital'
  | 'tachometer-alt-average'
  | 'tachometer-alt-fast'
  | 'tachometer-alt-fastest'
  | 'tachometer-alt-slow'
  | 'tachometer-alt-slowest'
  | 'tachometer-alt'
  | 'tachometer-average'
  | 'tachometer-fast'
  | 'tachometer-fastest'
  | 'tachometer-slow'
  | 'tachometer-slowest'
  | 'tachometer'
  | 'taco'
  | 'tag'
  | 'tags'
  | 'tally-1'
  | 'tally-2'
  | 'tally-3'
  | 'tally-4'
  | 'tally-5'
  | 'tally'
  | 'tamale'
  | 'tanakh'
  | 'tank-water'
  | 'tape'
  | 'tarp-droplet'
  | 'tarp'
  | 'tasks-alt'
  | 'tasks'
  | 'taxi-bus'
  | 'taxi'
  | 'teddy-bear'
  | 'teeth-open'
  | 'teeth'
  | 'telescope'
  | 'teletype-answer'
  | 'teletype'
  | 'television'
  | 'temperature-0'
  | 'temperature-1'
  | 'temperature-2'
  | 'temperature-3'
  | 'temperature-4'
  | 'temperature-arrow-down'
  | 'temperature-arrow-up'
  | 'temperature-down'
  | 'temperature-empty'
  | 'temperature-frigid'
  | 'temperature-full'
  | 'temperature-half'
  | 'temperature-high'
  | 'temperature-hot'
  | 'temperature-list'
  | 'temperature-low'
  | 'temperature-quarter'
  | 'temperature-snow'
  | 'temperature-sun'
  | 'temperature-three-quarters'
  | 'temperature-up'
  | 'tenge-sign'
  | 'tenge'
  | 'tennis-ball'
  | 'tent-arrow-down-to-line'
  | 'tent-arrow-left-right'
  | 'tent-arrow-turn-left'
  | 'tent-arrows-down'
  | 'tent'
  | 'tents'
  | 'terminal'
  | 'text-height'
  | 'text-size'
  | 'text-slash'
  | 'text-width'
  | 'text'
  | 'th-large'
  | 'th-list'
  | 'th'
  | 'theater-masks'
  | 'thermometer-0'
  | 'thermometer-1'
  | 'thermometer-2'
  | 'thermometer-3'
  | 'thermometer-4'
  | 'thermometer-empty'
  | 'thermometer-full'
  | 'thermometer-half'
  | 'thermometer-quarter'
  | 'thermometer-three-quarters'
  | 'thermometer'
  | 'theta'
  | 'thought-bubble'
  | 'thumb-tack'
  | 'thumbs-down'
  | 'thumbs-up'
  | 'thumbtack'
  | 'thunderstorm-moon'
  | 'thunderstorm-sun'
  | 'thunderstorm'
  | 'tick'
  | 'ticket-airline'
  | 'ticket-alt'
  | 'ticket-simple'
  | 'ticket'
  | 'tickets-airline'
  | 'tilde'
  | 'timeline-arrow'
  | 'timeline'
  | 'timer'
  | 'times-circle'
  | 'times-hexagon'
  | 'times-octagon'
  | 'times-rectangle'
  | 'times-square'
  | 'times-to-slot'
  | 'times'
  | 'tint-slash'
  | 'tint'
  | 'tire-flat'
  | 'tire-pressure-warning'
  | 'tire-rugged'
  | 'tire'
  | 'tired'
  | 'toggle-large-off'
  | 'toggle-large-on'
  | 'toggle-off'
  | 'toggle-on'
  | 'toilet-paper-alt'
  | 'toilet-paper-blank-under'
  | 'toilet-paper-blank'
  | 'toilet-paper-check'
  | 'toilet-paper-reverse-alt'
  | 'toilet-paper-reverse-slash'
  | 'toilet-paper-reverse'
  | 'toilet-paper-slash'
  | 'toilet-paper-under-slash'
  | 'toilet-paper-under'
  | 'toilet-paper-xmark'
  | 'toilet-paper'
  | 'toilet-portable'
  | 'toilet'
  | 'toilets-portable'
  | 'tomato'
  | 'tombstone-alt'
  | 'tombstone-blank'
  | 'tombstone'
  | 'toolbox'
  | 'tools'
  | 'tooth'
  | 'toothbrush'
  | 'torah'
  | 'torii-gate'
  | 'tornado'
  | 'tower-broadcast'
  | 'tower-cell'
  | 'tower-control'
  | 'tower-observation'
  | 'tractor'
  | 'trademark'
  | 'traffic-cone'
  | 'traffic-light-go'
  | 'traffic-light-slow'
  | 'traffic-light-stop'
  | 'traffic-light'
  | 'trailer'
  | 'train-subway-tunnel'
  | 'train-subway'
  | 'train-track'
  | 'train-tram'
  | 'train-tunnel'
  | 'train'
  | 'tram'
  | 'transformer-bolt'
  | 'transgender-alt'
  | 'transgender'
  | 'transporter-1'
  | 'transporter-2'
  | 'transporter-3'
  | 'transporter-4'
  | 'transporter-5'
  | 'transporter-6'
  | 'transporter-7'
  | 'transporter-empty'
  | 'transporter'
  | 'trash-alt-slash'
  | 'trash-alt'
  | 'trash-arrow-turn-left'
  | 'trash-arrow-up'
  | 'trash-can-arrow-turn-left'
  | 'trash-can-arrow-up'
  | 'trash-can-check'
  | 'trash-can-clock'
  | 'trash-can-list'
  | 'trash-can-plus'
  | 'trash-can-slash'
  | 'trash-can-undo'
  | 'trash-can-xmark'
  | 'trash-can'
  | 'trash-check'
  | 'trash-circle'
  | 'trash-clock'
  | 'trash-list'
  | 'trash-plus'
  | 'trash-restore-alt'
  | 'trash-restore'
  | 'trash-slash'
  | 'trash-undo-alt'
  | 'trash-undo'
  | 'trash-xmark'
  | 'trash'
  | 'treasure-chest'
  | 'tree-alt'
  | 'tree-christmas'
  | 'tree-city'
  | 'tree-deciduous'
  | 'tree-decorated'
  | 'tree-large'
  | 'tree-palm'
  | 'tree'
  | 'trees'
  | 'trian-balbot'
  | 'triangle-circle-square'
  | 'triangle-exclamation'
  | 'triangle-instrument'
  | 'triangle-music'
  | 'triangle-person-digging'
  | 'triangle'
  | 'tricycle-adult'
  | 'tricycle'
  | 'trillium'
  | 'trophy-alt'
  | 'trophy-star'
  | 'trophy'
  | 'trowel-bricks'
  | 'trowel'
  | 'truck-arrow-right'
  | 'truck-bolt'
  | 'truck-clock'
  | 'truck-container-empty'
  | 'truck-container'
  | 'truck-couch'
  | 'truck-droplet'
  | 'truck-fast'
  | 'truck-field-un'
  | 'truck-field'
  | 'truck-flatbed'
  | 'truck-front'
  | 'truck-loading'
  | 'truck-medical'
  | 'truck-monster'
  | 'truck-moving'
  | 'truck-pickup'
  | 'truck-plane'
  | 'truck-plow'
  | 'truck-ramp-box'
  | 'truck-ramp-couch'
  | 'truck-ramp'
  | 'truck-tow'
  | 'truck'
  | 'trumpet'
  | 'try'
  | 'tshirt'
  | 'tty-answer'
  | 'tty'
  | 'tugrik-sign'
  | 'turkey'
  | 'turkish-lira-sign'
  | 'turkish-lira'
  | 'turn-down-left'
  | 'turn-down-right'
  | 'turn-down'
  | 'turn-up'
  | 'turntable'
  | 'turtle'
  | 'tv-alt'
  | 'tv-music'
  | 'tv-retro'
  | 'tv'
  | 'typewriter'
  | 'u'
  | 'ufo-beam'
  | 'ufo'
  | 'umbrella-alt'
  | 'umbrella-beach'
  | 'umbrella-simple'
  | 'umbrella'
  | 'underline'
  | 'undo-alt'
  | 'undo'
  | 'unicorn'
  | 'uniform-martial-arts'
  | 'union'
  | 'universal-access'
  | 'university'
  | 'unlink'
  | 'unlock-alt'
  | 'unlock-keyhole'
  | 'unlock'
  | 'unsorted'
  | 'up-down-left-right'
  | 'up-down'
  | 'up-from-bracket'
  | 'up-from-dotted-line'
  | 'up-from-line'
  | 'up-left'
  | 'up-long'
  | 'up-right-and-down-left-from-center'
  | 'up-right-from-square'
  | 'up-right'
  | 'up-to-dotted-line'
  | 'up-to-line'
  | 'up'
  | 'upload'
  | 'usb-drive'
  | 'usd-circle'
  | 'usd-square'
  | 'usd'
  | 'user-alien'
  | 'user-alt-slash'
  | 'user-alt'
  | 'user-astronaut'
  | 'user-bounty-hunter'
  | 'user-chart'
  | 'user-check'
  | 'user-chef'
  | 'user-circle'
  | 'user-clock'
  | 'user-cog'
  | 'user-construction'
  | 'user-cowboy'
  | 'user-crown'
  | 'user-doctor-hair-long'
  | 'user-doctor-hair'
  | 'user-doctor-message'
  | 'user-doctor'
  | 'user-edit'
  | 'user-friends'
  | 'user-gear'
  | 'user-graduate'
  | 'user-group-crown'
  | 'user-group-simple'
  | 'user-group'
  | 'user-hair-buns'
  | 'user-hair-long'
  | 'user-hair-mullet'
  | 'user-hair'
  | 'user-hard-hat'
  | 'user-headset'
  | 'user-helmet-safety'
  | 'user-injured'
  | 'user-large-slash'
  | 'user-large'
  | 'user-lock'
  | 'user-magnifying-glass'
  | 'user-md-chat'
  | 'user-md'
  | 'user-minus'
  | 'user-music'
  | 'user-ninja'
  | 'user-nurse-hair-long'
  | 'user-nurse-hair'
  | 'user-nurse'
  | 'user-pen'
  | 'user-pilot-tie'
  | 'user-pilot'
  | 'user-plus'
  | 'user-police-tie'
  | 'user-police'
  | 'user-robot-xmarks'
  | 'user-robot'
  | 'user-secret'
  | 'user-shakespeare'
  | 'user-shield'
  | 'user-slash'
  | 'user-tag'
  | 'user-tie-hair-long'
  | 'user-tie-hair'
  | 'user-tie'
  | 'user-times'
  | 'user-unlock'
  | 'user-visor'
  | 'user-vneck-hair-long'
  | 'user-vneck-hair'
  | 'user-vneck'
  | 'user-xmark'
  | 'user'
  | 'users-between-lines'
  | 'users-class'
  | 'users-cog'
  | 'users-crown'
  | 'users-gear'
  | 'users-line'
  | 'users-medical'
  | 'users-rays'
  | 'users-rectangle'
  | 'users-slash'
  | 'users-viewfinder'
  | 'users'
  | 'utensil-fork'
  | 'utensil-knife'
  | 'utensil-spoon'
  | 'utensils-alt'
  | 'utensils-slash'
  | 'utensils'
  | 'utility-pole-double'
  | 'utility-pole'
  | 'v'
  | 'vacuum-robot'
  | 'vacuum'
  | 'value-absolute'
  | 'van-shuttle'
  | 'vault'
  | 'vcard'
  | 'vector-circle'
  | 'vector-polygon'
  | 'vector-square'
  | 'vent-damper'
  | 'venus-double'
  | 'venus-mars'
  | 'venus'
  | 'vest-patches'
  | 'vest'
  | 'vhs'
  | 'vial-circle-check'
  | 'vial-virus'
  | 'vial'
  | 'vials'
  | 'video-arrow-down-left'
  | 'video-arrow-up-right'
  | 'video-camera'
  | 'video-circle'
  | 'video-handheld'
  | 'video-plus'
  | 'video-slash'
  | 'video'
  | 'vihara'
  | 'violin'
  | 'virus-covid-slash'
  | 'virus-covid'
  | 'virus-slash'
  | 'virus'
  | 'viruses'
  | 'voicemail'
  | 'volcano'
  | 'volleyball-ball'
  | 'volleyball'
  | 'volume-control-phone'
  | 'volume-down'
  | 'volume-high'
  | 'volume-low'
  | 'volume-medium'
  | 'volume-mute'
  | 'volume-off'
  | 'volume-slash'
  | 'volume-times'
  | 'volume-up'
  | 'volume-xmark'
  | 'volume'
  | 'vote-nay'
  | 'vote-yea'
  | 'vr-cardboard'
  | 'w'
  | 'waffle'
  | 'wagon-covered'
  | 'walker'
  | 'walkie-talkie'
  | 'walking'
  | 'wall-brick'
  | 'wallet'
  | 'wand-magic-sparkles'
  | 'wand-magic'
  | 'wand-sparkles'
  | 'wand'
  | 'warehouse-alt'
  | 'warehouse-full'
  | 'warehouse'
  | 'warning'
  | 'washer'
  | 'washing-machine'
  | 'watch-apple'
  | 'watch-calculator'
  | 'watch-fitness'
  | 'watch-smart'
  | 'watch'
  | 'water-arrow-down'
  | 'water-arrow-up'
  | 'water-ladder'
  | 'water-lower'
  | 'water-rise'
  | 'water'
  | 'watermelon-slice'
  | 'wave-pulse'
  | 'wave-sine'
  | 'wave-square'
  | 'wave-triangle'
  | 'waveform-circle'
  | 'waveform-lines'
  | 'waveform-path'
  | 'waveform'
  | 'webcam-slash'
  | 'webcam'
  | 'webhook'
  | 'weight-hanging'
  | 'weight-scale'
  | 'weight'
  | 'whale'
  | 'wheat-alt'
  | 'wheat-awn-circle-exclamation'
  | 'wheat-awn-slash'
  | 'wheat-awn'
  | 'wheat-slash'
  | 'wheat'
  | 'wheelchair-alt'
  | 'wheelchair-move'
  | 'wheelchair'
  | 'whiskey-glass-ice'
  | 'whiskey-glass'
  | 'whistle'
  | 'wifi-1'
  | 'wifi-2'
  | 'wifi-3'
  | 'wifi-exclamation'
  | 'wifi-fair'
  | 'wifi-slash'
  | 'wifi-strong'
  | 'wifi-weak'
  | 'wifi'
  | 'wind-circle-exclamation'
  | 'wind-turbine'
  | 'wind-warning'
  | 'wind'
  | 'window-alt'
  | 'window-close'
  | 'window-flip'
  | 'window-frame-open'
  | 'window-frame'
  | 'window-maximize'
  | 'window-minimize'
  | 'window-restore'
  | 'window'
  | 'windsock'
  | 'wine-bottle'
  | 'wine-glass-alt'
  | 'wine-glass-crack'
  | 'wine-glass-empty'
  | 'wine-glass'
  | 'won-sign'
  | 'won'
  | 'worm'
  | 'wreath-laurel'
  | 'wreath'
  | 'wrench-simple'
  | 'wrench'
  | 'x-ray'
  | 'x'
  | 'xmark-circle'
  | 'xmark-hexagon'
  | 'xmark-large'
  | 'xmark-octagon'
  | 'xmark-square'
  | 'xmark-to-slot'
  | 'xmark'
  | 'xmarks-lines'
  | 'y'
  | 'yen-sign'
  | 'yen'
  | 'yin-yang'
  | 'z'
  | 'zap'
  | 'zzz';
