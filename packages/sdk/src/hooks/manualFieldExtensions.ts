import { Ctx } from '../ctx/base';

export type ManualFieldExtensionsHook = {
  /**
   * Use this function to declare new field extensions that users will be able
   * to install manually in some field
   *
   * @tag manualFieldExtensions
   */
  manualFieldExtensions: (ctx: Ctx) => ManualFieldExtension[];
};

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

/**
 * The sidebar in the Content Area presents a number of user-defined menu-items.
 * This object represents a new item to be added in the sidebar.
 */

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
