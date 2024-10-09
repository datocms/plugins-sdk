import type { SchemaTypes } from '@datocms/cma-client';

type Item = SchemaTypes.Item;
type ItemType = SchemaTypes.ItemType;

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
  /** Provides information on how many blocks are currently present in the form */
  blocksAnalysis: BlocksAnalysis;
};

/** Current number of blocks present in form state */
export type BlocksAnalysis = {
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
