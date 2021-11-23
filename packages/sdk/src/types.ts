import {
  Account,
  Field,
  Item,
  ModelBlock,
  Plugin,
  PluginAttributes,
  Role,
  Site,
  SsoUser,
  Upload,
  User,
} from './SiteApiSchema';

// /** A menu item displayed inside a custom tab in the top-bar of the UI */
// export type MainNavigationTabItem = {
//   /** Label to be shown. Must be unique. */
//   label: string;
//   /** FontAwesome icon name to be shown alongside the label */
//   icon: string;
//   /** ID of the page linked to the tab */
//   pointsTo: {
//     pageId: string;
//   };
// }

/** A tab to be displayed in the top-bar of the UI */
export type MainNavigationTab = {
  /** Label to be shown. Must be unique. */
  label: string;
  /** FontAwesome icon name to be shown alongside the label */
  icon: string;
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
   * clash with the one of another plugin! *
   */
  rank?: number;

  // FUTURE

  // /** The list of sub-items it contains **/
  // items?: MainNavigationTabItem[];
};

/** An item contained in a Settings Area group */
export type SettingsAreaSidebarItem = {
  /** Label to be shown. Must be unique. */
  label: string;
  /** FontAwesome icon name to be shown alongside the label */
  icon: string;
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

// type ContentAreaSidebarItemChild = {
//   /** Label to be shown. Must be unique. */
//   label: string;
//   /** FontAwesome icon name to be shown alongside the label */
//   icon: string;
//   /** ID of the page linked to the item */
//   pointsTo: {
//     pageId: string;
//   };
//   /** The list of sub-items it contains **/
//   items?: ContentAreaSidebarItemChild[];
// }

/**
 * The sidebar in the Content Area presents a number of user-defined menu-items.
 * This object represents a new item to be added in the sidebar.
 */
export type ContentAreaSidebarItem = {
  /** Label to be shown. Must be unique. */
  label: string;
  /** FontAwesome icon name to be shown alongside the label */
  icon: string;
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

  // FUTURE

  // /** The list of sub-items it contains **/
  // items?: ContentAreaSidebarItemChild[];
};

export type FieldExtensionType = 'editor' | 'addon';

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
  /** The type of fields that the field extension in compatible with */
  fieldTypes: NonNullable<PluginAttributes['field_types']>;
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
   * available if `currentAccessToken` permission is granted
   */
  currentAccessToken: string | undefined;
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
      newFieldExtensionId?: 'string';
      newFieldExtensionParameters?: Record<string, unknown>;
    }
  | {
      operation: 'setEditor';
      fieldExtensionId: 'string';
      parameters: Record<string, unknown>;
    }
  | {
      operation: 'removeAddon';
      index: number;
    }
  | {
      operation: 'updateAddon';
      index: number;
      newFieldExtensionId?: 'string';
      newParameters?: Record<string, unknown>;
    }
  | {
      operation: 'insertAddon';
      index: number;
      fieldExtensionId: 'string';
      parameters: Record<string, unknown>;
    };

export type UpdateParametersMethods = {
  /**
   * Updates the plugin parameters.
   *
   * Always check `ctx.currentRole.meta.final_permissions.can_edit_schema`
   * before calling this, as the user might not have the permission to perform
   * the operation.
   *
   * @example
   *   ctx.updatePluginParameters({ debugMode: true });
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
   *   const fieldId = 234;
   *   ctx.updateFieldAppearance(234, [
   *     {
   *       operation: 'updateEditor',
   *       newFieldExtensionParameters: { foo: 'bar' },
   *     },
   *     {
   *       operation: 'updateAddon',
   *       index: 2,
   *       newFieldExtensionParameters: { bar: 'qux' },
   *     },
   *   ]);
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
   *   const fields = await sdk.loadItemTypeFields('810907');
   *   sdk.notice(
   *     `Success! ${fields
   *       .map((field) => field.attributes.api_key)
   *       .join(', ')}`,
   *   );
   */
  loadItemTypeFields: (itemTypeId: string) => Promise<Field[]>;
  /**
   * Loads all the fields in the project that are currently using the plugin for
   * one of its manual field extensions.
   *
   * @example
   *   const fields = await sdk.loadFieldsUsingPlugin();
   *   sdk.notice(
   *     `Success! ${fields
   *       .map((field) => field.attributes.api_key)
   *       .join(', ')}`,
   *   );
   */
  loadFieldsUsingPlugin: () => Promise<Field[]>;
  /**
   * Loads all regular users. Users will be returned and will also be available
   * in the the `users` property.
   *
   * @example
   *   const users = await sdk.loadUsers();
   *   sdk.notice(`Success! ${users.map((user) => i.id).join(', ')}`);
   */
  loadUsers: () => Promise<User[]>;
  /**
   * Loads all SSO users. Users will be returned and will also be available in
   * the the `ssoUsers` property.
   *
   * @example
   *   const users = await sdk.loadSsoUsers();
   *   sdk.notice(`Success! ${users.map((user) => i.id).join(', ')}`);
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
   *   const item = await sdk.createNewItem('810907');
   *   if (item) {
   *     sdk.notice(`Success! ${item.id}`);
   *   } else {
   *     sdk.alert('Closed!');
   *   }
   */
  createNewItem: (itemTypeId: string) => Promise<Item | null>;
  /**
   * Opens a dialog for selecting one (or multiple) record(s) from a list of
   * existing records of type `itemTypeId`. It returns a promise resolved with
   * the selected record(s), or `null` if the user closes the dialog without
   * choosing any record.
   *
   * @example
   *   const items = await ctx.selectItem('810907', { multiple: true });
   *   if (items) {
   *     ctx.notice(`Success! ${items.map((i) => i.id).join(', ')}`);
   *   } else {
   *     ctx.alert('Closed!');
   *   }
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
   *   const item = await sdk.editItem('50479504');
   *
   *   if (item) {
   *     sdk.notice(`Success! ${item.id}`);
   *   } else {
   *     sdk.alert('Closed!');
   *   }
   */
  editItem: (itemId: string) => Promise<Item | null>;
};

/** These methods can be used to show UI-consistent toast notifications to the end-user */
export type ToastMethods = {
  /**
   * Triggers an "error" toast displaying the selected message
   *
   * @example
   *   sdk.alert('Alert!');
   */
  alert: (message: string) => void;
  /**
   * Triggers a "success" toast displaying the selected message
   *
   * @example
   *   sdk.notice('Notice!');
   */
  notice: (message: string) => void;
  /**
   * Triggers a custom toast displaying the selected message (and optionally a CTA)
   *
   * @example
   *   const result = await sdk.customToast({
   *     type: 'warning',
   *     message: 'Just a sample warning notification!',
   *     dismissOnPageChange: true,
   *     dismissAfterTimeout: 22000,
   *     cta: {
   *       label: 'Execute call-to-action',
   *       value: 'cta',
   *     },
   *   });
   *
   *   if (result === 'cta') {
   *     sdk.notice(`Clicked CTA!`);
   *   }
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
   *   const item = await sdk.selectUpload({ multiple: false });
   *
   *   if (item) {
   *     sdk.notice(`Success! ${item.id}`);
   *   } else {
   *     sdk.alert('Closed!');
   *   }
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
   *   const item = await sdk.editUpload('21717537');
   *
   *   if (item) {
   *     sdk.notice(`Success! ${item.id}`);
   *   } else {
   *     sdk.alert('Closed!');
   *   }
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
   *   const result = await sdk.editUploadMetadata({
   *     upload_id: '21717537',
   *     alt: null,
   *     title: null,
   *     custom_data: {},
   *     focal_point: null,
   *   });
   *
   *   if (result) {
   *     sdk.notice(`Success! ${JSON.stringify(result)}`);
   *   } else {
   *     sdk.alert('Closed!');
   *   }
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
   *   const result = await sdk.openModal({
   *     id: 'regular',
   *     title: 'Custom title!',
   *     width: 'l',
   *     parameters: { foo: 'bar' },
   *   });
   *   if (result) {
   *     sdk.notice(`Success! ${JSON.stringify(result)}`);
   *   } else {
   *     sdk.alert('Closed!');
   *   }
   */
  openModal: (modal: Modal) => Promise<unknown>;
  /**
   * Opens a UI-consistent confirmation dialog. Returns a promise resolved with
   * the value of the choice made by the user
   *
   * @example
   *   const result = await sdk.openConfirm({
   *     title: 'Custom title',
   *     content:
   *       'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
   *     choices: [
   *       {
   *         label: 'Positive',
   *         value: 'positive',
   *         intent: 'positive',
   *       },
   *       {
   *         label: 'Negative',
   *         value: 'negative',
   *         intent: 'negative',
   *       },
   *     ],
   *     cancel: {
   *       label: 'Cancel',
   *       value: false,
   *     },
   *   });
   *   if (result) {
   *     sdk.notice(`Success! ${result}`);
   *   } else {
   *     sdk.alert('Cancelled!');
   *   }
   */
  openConfirm: (options: ConfirmOptions) => Promise<unknown>;
};

/** These methods can be used to take the user to different pages */
export type NavigateMethods = {
  /**
   * Moves the user to another URL internal to the backend
   *
   * @example
   *   sdk.navigateTo('/');
   */
  navigateTo: (path: string) => void;
};

/** These methods can be used to set various properties of the containing iframe */
export type IframeMethods = {
  /** Sets the height for the iframe */
  setHeight: (number: number) => void;
};

export type RenderMethods = LoadDataMethods &
  UpdateParametersMethods &
  ToastMethods &
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
   *   sdk.toggleField(sdk.fieldPath, true);
   */
  toggleField: (path: string, show: boolean) => void;
  /**
   * Disables/re-enables a specific field in the form
   *
   * @example
   *   sdk.disableField(sdk.fieldPath, true);
   */
  disableField: (path: string, disable: boolean) => void;
  /**
   * Smoothly navigates to a specific field in the form. If the field is
   * localized it will switch language tab and then navigate to the chosen field.
   *
   * @example
   *   sdk.scrollToField(sdk.fieldPath);
   */
  scrollToField: (path: string, locale?: string) => void;
  /**
   * Changes a specific path of the `formValues` object
   *
   * @example
   *   sdk.setFieldValue(sdk.fieldPath, 'new value');
   */
  setFieldValue: (path: string, value: unknown) => void;
  /**
   * Triggers a submit form for current record
   *
   * @example
   *   await sdk.saveCurrentItem();
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
   */
  resolve: (returnValue: unknown) => void;
};

export type RenderModalMethods = RenderMethods &
  IframeMethods &
  RenderModalAdditionalMethods;

export type RenderModalPropertiesAndMethods = RenderModalMethods &
  RenderModalProperties;

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
   *   ctx.setParameters({ color: '#ff0000' });
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
