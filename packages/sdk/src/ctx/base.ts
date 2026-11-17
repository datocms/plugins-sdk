import type { RawApiTypes } from '@datocms/cma-client';
import { isBoolean, isRecord, isString } from '../guardUtils.js';

type Account = RawApiTypes.Account;
type Field = RawApiTypes.Field;
type Fieldset = RawApiTypes.Fieldset;
type Item = RawApiTypes.Item;
type ItemType = RawApiTypes.ItemType;
type Organization = RawApiTypes.Organization;
type Plugin = RawApiTypes.Plugin;
type Role = RawApiTypes.Role;
type Site = RawApiTypes.Site;
type SsoUser = RawApiTypes.SsoUser;
type Upload = RawApiTypes.Upload;
type User = RawApiTypes.User;

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

  /**
   * The URL of the Content Delivery API (GraphQL) endpoint for the current
   * project and environment.
   *
   * In the vast majority of cases you don't need this: the CDA endpoint is at a
   * well-known, stable URL. It's exposed here only to support DatoCMS internal
   * testing against non-production environments (e.g. staging).
   */
  cdaEndpointUrl: string;

  /**
   * The base URL of the Content Management API.
   *
   * In the vast majority of cases you don't need this: the CMA lives at a
   * well-known, stable URL. It's exposed here only to support DatoCMS internal
   * testing against non-production environments (e.g. staging).
   */
  cmaBaseUrl: string;

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
   * UI preferences of the current user: the preferred locale, and the
   * settings that the CMS uses to format dates and times
   */
  ui: {
    /** Preferred locale */
    locale: string;
    /** Preferred date format, as a `date-fns` pattern, for example `dd/MM/yyyy` */
    dateFormat: string;
    /** Preferred time zone, as an IANA name, for example `Europe/Rome` */
    timezone: string;
    /** Whether times use a 24-hour clock (`true`) or a 12-hour clock */
    twentyFourHour: boolean;
  };

  /**
   * An object containing the theme colors for the current DatoCMS project
   *
   * @deprecated Use `cssDesignTokens` instead. This property is kept
   *   for backward compatibility with third-party plugins.
   */
  theme: Theme;

  /**
   * Semantic color tokens for the current DatoCMS project, pre-computed by
   * the host. A map of CSS custom property names (e.g.
   * `--color--raised--surface`) to their resolved values for the current
   * color scheme.
   */
  cssDesignTokens: CssDesignTokens;

  /**
   * The appearance color scheme the host CMS is currently using. Resolved —
   * `'system'` is already expanded to `'light'` or `'dark'` by the host.
   *
   * The SDK runtime reflects this onto `document.documentElement` two ways:
   * the `data-color-scheme="light"` / `data-color-scheme="dark"` attribute,
   * so plugin CSS can branch with `[data-color-scheme="dark"] { … }`
   * selectors; and the actual `color-scheme` CSS property, so `light-dark()`
   * resolves to the correct branch (and native form controls / scrollbars
   * match) everywhere in the plugin frame. For non-CSS decisions (choosing a
   * logo asset, a syntax-highlighting preset, …) branch on `ctx.colorScheme`
   * directly.
   */
  colorScheme: 'light' | 'dark';

  /**
   * Font size of the host's `<html>` element, in CSS pixels. The host steps
   * it with the viewport width, so the SDK runtime mirrors it onto the
   * plugin's `<html>`: `rem` units, and with them every `--font-size-*` and
   * `--spacing-*` token, then measure the same inside the frame as outside.
   *
   * Typed as required for parity with the other appearance fields (e.g.
   * `colorScheme`), but only hosts new enough to send it populate it: a plugin
   * running inside an older host reads `undefined` at runtime. Guard for that
   * if you consume the value directly.
   */
  rootFontSize: number;
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

/**
 * An object containing the theme colors for the current DatoCMS project
 *
 * @deprecated Use `cssDesignTokens` instead. This type is kept for
 *   backward compatibility with third-party plugins.
 */
export type Theme = {
  primaryColor: string;
  accentColor: string;
  semiTransparentAccentColor: string;
  lightColor: string;
  darkColor: string;
};

/**
 * Semantic color tokens for the current DatoCMS project, pre-computed by the
 * host. Only available on DatoCMS hosts that support the new token system.
 *
 * Each key is a ready-to-use CSS custom property name (including the leading
 * `--`), and each value is the resolved color for the host's current color
 * scheme — e.g. `{ '--color--raised--surface': 'oklch(…)' }`. The SDK applies
 * these verbatim onto the plugin canvas, so plugin CSS can reference them
 * directly with `var(--color--raised--surface)`.
 *
 * The token set is whatever the host sends; it is intentionally untyped so it
 * can evolve on the host without an SDK release.
 */
export type CssDesignTokens = Record<string, string>;

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
  /**
   * Resolves how the interface presents some records: the title, the image,
   * the status and the validity, the same that DatoCMS shows in its lists and
   * in its link fields. The result has the presentation of the plugins that
   * implement `buildItemPresentationInfo`, with the same `rank` rules.
   *
   * Pass IDs, or full records that you already have: a full record is used as
   * it is, and DatoCMS does not fetch it again. A record must have an ID. The
   * ID of a block works too: the block gets the presentation of its model,
   * with no `editPath`. One call resolves all the records, so call it once
   * for a list, not once for each record.
   *
   * The result is an array with the order and the length of `itemsOrIds`:
   * the entry at index i is the presentation of the record at index i. It is
   * `null` when the record does not exist, or when the current user cannot
   * read it. The same ID twice gives two entries.
   *
   * The result is a snapshot: it does not change when somebody edits the
   * record. Call the method again to get the new presentation. To get the
   * full records, call `loadItems`.
   *
   * @example
   *
   * ```js
   * const itemId = prompt('Please insert a record ID:');
   *
   * const [info] = await ctx.loadItemPresentationInfo([itemId]);
   *
   * if (info) {
   *   ctx.notice(`The title of the record is "${info.title}"`);
   * } else {
   *   ctx.alert('The record does not exist.');
   * }
   * ```
   */
  loadItemPresentationInfo: (
    itemsOrIds: Array<string | Item>,
    options?: LoadItemPresentationInfoOptions,
  ) => Promise<Array<ResolvedItemPresentationInfo | null>>;
  /**
   * Loads some records by ID, for example the records of the value of a link
   * field, which holds only their IDs. The ID of a block works too, for
   * example an ID from a field of blocks: the result is the block. One call
   * loads all the records, so call it once for a list, not once for each
   * record.
   *
   * A record has the same shape that `selectItem` and `editItem` give: the
   * current version of the record, with its draft changes. A field of blocks
   * (Modular Content, single block, Structured Text) holds the IDs of the
   * blocks, not the blocks.
   *
   * The result is an array with the order and the length of `itemIds`: the
   * entry at index i is the record with the ID at index i. It is `null` when
   * the record does not exist, or when the current user cannot read it. The
   * same ID twice gives two entries.
   *
   * The result is a snapshot: it does not change when somebody edits the
   * record. Call the method again to get the new record.
   *
   * @example
   *
   * ```js
   * const itemId = prompt('Please insert a record ID:');
   *
   * const [item] = await ctx.loadItems([itemId]);
   *
   * if (item) {
   *   ctx.notice(`The model of the record is ${item.relationships.item_type.data.id}`);
   * } else {
   *   ctx.alert('The record does not exist.');
   * }
   * ```
   */
  loadItems: (itemIds: string[]) => Promise<Array<Item | null>>;
  /**
   * Loads some assets of the Media Area by ID, for example the assets of the
   * value of a file or gallery field, which holds only their `upload_id`.
   * One call loads all the assets, so call it once for a list, not once for
   * each asset.
   *
   * The result is an array with the order and the length of `uploadIds`: the
   * entry at index i is the asset with the ID at index i. It is `null` when
   * the asset does not exist, or when the current user cannot read it. The
   * same ID twice gives two entries.
   *
   * The result is a snapshot: it does not change when somebody edits the
   * asset. Call the method again to get the new asset.
   *
   * @example
   *
   * ```js
   * const uploadId = prompt('Please insert an asset ID:');
   *
   * const [upload] = await ctx.loadUploads([uploadId]);
   *
   * if (upload) {
   *   ctx.notice(`The file name of the asset is "${upload.attributes.filename}"`);
   * } else {
   *   ctx.alert('The asset does not exist.');
   * }
   * ```
   */
  loadUploads: (uploadIds: string[]) => Promise<Array<Upload | null>>;
};

/** The options of `loadItemPresentationInfo` */
export type LoadItemPresentationInfoOptions = {
  /**
   * The locale of the title and of the image, for a model with localized
   * fields. Without it, DatoCMS uses the first locale of the project that
   * has a value.
   */
  preferredLocale?: string;
  /**
   * The size at which you draw the image, in CSS pixels. DatoCMS crops the
   * images of the Media Area and the frames of the videos to this size, with
   * two image pixels for each CSS pixel, for screens with a high density. The
   * other images (a map, a color, a date, the image of a plugin) come at
   * their own size: draw them with `object-fit: cover`.
   *
   * @default { width: 32, height: 32 }
   */
  preferredImageSize?: { width: number; height: number };
};

/**
 * How the interface presents a record, as `loadItemPresentationInfo`
 * resolves it.
 *
 * @see {isResolvedItemPresentationInfo}
 */
export type ResolvedItemPresentationInfo = {
  /** The ID of the record */
  id: string;
  /**
   * The title of the record, as text. A record with no title gets a title
   * like "Record #123".
   */
  title: string;
  /**
   * The image of the record. "image" is a picture to show in a square, cut
   * to fill it. "file" is an asset that is not a picture: show the icon of
   * its extension. `null` when the record has no image.
   */
  image:
    | { type: 'image'; url: string }
    | { type: 'file'; extension: string }
    | null;
  /** The ID of the model of the record */
  itemTypeId: string;
  /**
   * The publishing status of the record. Show it only when the model has
   * the draft mode (`draft_mode_active`): without it, a record is published
   * every time that it is saved.
   */
  status: 'draft' | 'updated' | 'published';
  /** False when the current version does not pass the validations */
  currentVersionValid: boolean;
  /** False when the published version does not pass the validations */
  publishedVersionValid: boolean;
  /**
   * The path of the page of the record in the interface, for
   * `ctx.navigateTo`. `null` when the record has no page of its own (a
   * block).
   */
  editPath: string | null;
};

export function isResolvedItemPresentationInfo(
  value: unknown,
): value is ResolvedItemPresentationInfo {
  if (!isRecord(value)) {
    return false;
  }

  const { image } = value;

  return (
    isString(value.id) &&
    isString(value.title) &&
    (image === null ||
      (isRecord(image) &&
        ((image.type === 'image' && isString(image.url)) ||
          (image.type === 'file' && isString(image.extension))))) &&
    isString(value.itemTypeId) &&
    (value.status === 'draft' ||
      value.status === 'updated' ||
      value.status === 'published') &&
    isBoolean(value.currentVersionValid) &&
    isBoolean(value.publishedVersionValid) &&
    (value.editPath === null || isString(value.editPath))
  );
}

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
   *   poster_time: null,
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
  /** Poster time in seconds (only for video assets) */
  // eslint-disable-next-line camelcase
  poster_time: number | null;
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
  /**
   * Asks the user to type a text before the choices turn on. Use it for an
   * action that the user cannot undo.
   */
  explicitConfirmation?: ConfirmExplicitConfirmation;
  /**
   * The label of a switch that is off at first. The user must turn it on
   * before the choices turn on.
   */
  acknowledgement?: string;
};

/** The text input of a `openConfirm` panel: see `explicitConfirmation` */
export type ConfirmExplicitConfirmation = {
  /** The label above the input */
  label: string;
  /** The text that the user must type, for example the name of a project */
  confirmString: string;
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
