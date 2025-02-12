import type { SchemaTypes } from '@datocms/cma-client';

type Account = SchemaTypes.Account;
type Field = SchemaTypes.Field;
type Fieldset = SchemaTypes.Fieldset;
type Item = SchemaTypes.Item;
type ItemType = SchemaTypes.ItemType;
type Organization = SchemaTypes.Organization;
type Plugin = SchemaTypes.Plugin;
type Role = SchemaTypes.Role;
type Site = SchemaTypes.Site;
type SsoUser = SchemaTypes.SsoUser;
type Upload = SchemaTypes.Upload;
type User = SchemaTypes.User;

export type Ctx<
  AdditionalProperties extends Record<string, unknown> = Record<string, never>,
  AdditionalMethods extends Record<string, unknown> = Record<string, never>,
> = BaseProperties & AdditionalProperties & BaseMethods & AdditionalMethods;

export type BaseProperties = PluginProperties &
  AuthenticationProperties &
  ProjectProperties &
  EntityReposProperties;

/**
 * Information about the current user using the CMS
 */
type AuthenticationProperties = {
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
};

/**
 * Information about the current plugin. Useful to access the plugin's global
 * configuration object.
 */
type PluginProperties = {
  /** The current plugin */
  plugin: Plugin;
};

/*
 * Information about the project
 */
type ProjectProperties = {
  /** The current DatoCMS project */
  site: Site;

  /** The ID of the current environment */
  environment: string;

  /** Whether the current environment is the primary one */
  isEnvironmentPrimary: boolean;

  /** The account/organization that is the project owner */
  owner: Account | Organization;

  /**
   * The account that is the project owner
   *
   * @deprecated Please use `.owner` instead, as the project owner can also be
   *   an organization
   */
  account: Account | undefined;

  /**
   * UI preferences of the current user (right now, only the preferred locale is
   * available)
   */
  ui: {
    /** Preferred locale */
    locale: string;
  };

  /** An object containing the theme colors for the current DatoCMS project */
  theme: Theme;
};

/**
 * These properties provide access to "entity repos", that is, the collection of
 * resources of a particular type that have been loaded by the CMS up to this
 * moment. The entity repos are objects, indexed by the ID of the entity itself.
 */
type EntityReposProperties = {
  /** All the models of the current DatoCMS project, indexed by ID */
  itemTypes: Partial<Record<string, ItemType>>;

  /**
   * All the fields currently loaded for the current DatoCMS project, indexed by
   * ID. If some fields you need are not present, use the `loadItemTypeFields`
   * function to load them.
   */
  fields: Partial<Record<string, Field>>;

  /**
   * All the fieldsets currently loaded for the current DatoCMS project, indexed
   * by ID. If some fields you need are not present, use the
   * `loadItemTypeFieldsets` function to load them.
   */
  fieldsets: Partial<Record<string, Fieldset>>;

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
};

/** An object containing the theme colors for the current DatoCMS project */
export type Theme = {
  primaryColor: string;
  accentColor: string;
  semiTransparentAccentColor: string;
  lightColor: string;
  darkColor: string;
};

export type BaseMethods = LoadDataMethods &
  UpdatePluginParametersMethods &
  ToastMethods &
  ItemDialogMethods &
  UploadDialogMethods &
  CustomDialogMethods &
  NavigateMethods;

/**
 * These methods can be used to asyncronously load additional information your
 * plugin needs to work
 */
type LoadDataMethods = {
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
 * These methods can be used to update both plugin parameters and manual field
 * extensions configuration.
 */
type UpdatePluginParametersMethods = {
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
 * These methods let you open the standard DatoCMS dialogs needed to interact
 * with records
 */
type ItemDialogMethods = {
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
type ToastMethods = {
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
type UploadDialogMethods = {
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
type CustomDialogMethods = {
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
type NavigateMethods = {
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

export type ItemListLocationQuery = {
  locale?: string;
  filter?: {
    query?: string;
    fields?: Record<string, unknown>;
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

/** Focal point of an image asset */
export type FocalPoint = {
  /** Horizontal position expressed as float between 0 and 1 */
  x: number;
  /** Vertical position expressed as float between 0 and 1 */
  y: number;
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
