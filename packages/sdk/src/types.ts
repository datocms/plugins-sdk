import {
  Account,
  Field,
  Item,
  ModelBlock,
  Plugin,
  PluginAttributes,
  Site,
  SsoUser,
  Upload,
  User,
} from './SiteApiSchema';

export type DashboardWidget = {
  id: string;
  label: string;
  invocationParams: Record<string, unknown>;
};

export type NavigationPage = {
  id: string;
  label: string;
  icon: string;
};

export type AdminPageGroup = {
  id: string;
  label: string;
};

export type AdminPage = {
  id: string;
  label: string;
  icon: string;
  group: string;
};

export type ContentPage = {
  id: string;
  label: string;
  icon: string;
  location: 'top' | 'bottom';
};

export type FieldType =
  | 'boolean'
  | 'date'
  | 'date_time'
  | 'float'
  | 'integer'
  | 'string'
  | 'text'
  | 'json'
  | 'color'
  | 'rich_text';

export type FieldExtensionType = 'field_editor' | 'field_addon' | 'sidebar';

export type FieldExtension = {
  id: string;
  name: string;
  type: FieldExtensionType;
  fieldTypes: FieldType[];
  configurable: boolean;
};

export type SidebarPane = {
  id: string;
  label: string;
  invocationParams?: Record<string, unknown>;
  startOpen?: boolean;
};

export type FieldExtensionOverride = {
  editor?: {
    id: string;
    type: 'field_editor' | 'sidebar';
    invocationParams: Record<string, unknown>;
  };
  addons?: Array<{ id: string; invocationParams: Record<string, unknown> }>;
};

export type AssetSource = {
  id: string;
  label: string;
  icon: string;
};

export type Theme = {
  primaryColor: string;
  accentColor: string;
  semiTransparentAccentColor: string;
  lightColor: string;
  darkColor: string;
};

export type FocalPoint = {
  x: number;
  y: number;
};

export type FileFieldValue = {
  // eslint-disable-next-line camelcase
  upload_id: string;
  alt: string | null;
  title: string | null;
  // eslint-disable-next-line camelcase
  focal_point: FocalPoint | null;
  // eslint-disable-next-line camelcase
  custom_data: Record<string, string>;
};

export type Modal = {
  title?: string;
  closeDisabled?: boolean;
  width?: 's' | 'm' | 'l' | 'xl' | 'fullWidth' | number;
  invocationParams: Record<string, unknown>;
};

export type ConfirmChoice = {
  label: string;
  value: unknown;
  intent?: 'positive' | 'negative';
};

export type ConfirmOptions = {
  title: string;
  content: string;
  choices: ConfirmChoice[];
  cancel: ConfirmChoice;
};

export type CommonMeta = {
  site: Site;
  environment: string | null;
  itemTypes: Partial<Record<string, ModelBlock>>;
  currentUser: User | SsoUser | Account;
  plugin: Plugin;
};

export type InitMetaAdditions = {
  mode: 'init';
};

export type InitMeta = CommonMeta & InitMetaAdditions;

export type InitMethods = {
  getSettings: () => Promise<InitMeta>;
};

export type CommonRenderMetaAdditions = {
  fields: Partial<Record<string, Field>>;
  theme: Theme;
  users: Partial<Record<string, User>>;
  account: Account;
  plugin: Plugin;
};

export type CommonRenderMeta = CommonMeta & CommonRenderMetaAdditions;

export type CommonRenderMethods = {
  setHeight: (number: number) => void;
  navigateTo: (path: string) => void;
  loadItemTypeFields: (itemTypeId: string) => Promise<Field[]>;
  createNewItem: (itemTypeId: string) => Promise<Item | null>;
  selectItem:
    | ((
        itemTypeId: string,
        options: {
          multiple: true;
        },
      ) => Promise<Item[] | null>)
    | ((
        itemTypeId: string,
        options?: {
          multiple: false;
        },
      ) => Promise<Item | null>);
  editItem: (itemId: string) => Promise<Item | null>;
  notice: (message: string) => void;
  alert: (message: string) => void;
  selectUpload:
    | ((options: { multiple: true }) => Promise<Upload[] | null>)
    | ((options?: { multiple: false }) => Promise<Upload | null>);
  editUpload: (uploadId: string) => Promise<Upload | null>;
  editUploadMetadata: (
    fileFieldValue: FileFieldValue,
    locale?: string,
  ) => Promise<FileFieldValue | null>;
  openModal: (modal: Modal) => Promise<unknown>;
  openConfirm: (options: ConfirmOptions) => Promise<unknown>;
};

export type CommonRenderItemFormMetaAdditions = {
  locale: string;
  itemId: string | null;
  itemStatus: string;
  itemValue: Record<string, unknown>;
  isSubmitting: boolean;
  isFormDirty: boolean;
  itemType: ModelBlock | undefined;
};

export type CommonRenderItemFormMeta = CommonRenderMeta & CommonRenderItemFormMetaAdditions;

export type CommonRenderItemFormMethodsAdditions = {
  getSettings: () => Promise<CommonRenderItemFormMeta>;
  toggleField: (path: string, show: boolean) => void;
  disableField: (path: string, disable: boolean) => void;
  scrollToField: (path: string, locale?: string) => void;
  setFieldValue: (path: string, value: unknown) => void;
  saveCurrentItem: () => void;
};

export type CommonRenderItemFormMethods = CommonRenderMethods &
  CommonRenderItemFormMethodsAdditions;

export type RenderSidebarPaneMetaAdditions = {
  mode: 'renderSidebarPane';
  sidebarPane: SidebarPane;
};

export type RenderSidebarPaneMeta = CommonRenderMeta & RenderSidebarPaneMetaAdditions;

export type RenderSidebarPaneMethodsAdditions = {
  getSettings: () => Promise<RenderSidebarPaneMeta>;
};

export type RenderSidebarPaneMethods = CommonRenderMethods & RenderSidebarPaneMethodsAdditions;

export type RenderFieldExtensionMetaAdditions = {
  mode: 'renderFieldExtension';
  fieldExtension: FieldExtension;
  parameters: {
    instance: Record<string, unknown>;
    global: PluginAttributes['parameters'] | undefined;
  };
  placeholder: string;
  disabled: boolean;
  fieldPath: string;
  field: Field | undefined;
  parentField: Field | undefined;
  fieldId: string;
  parentFieldId: string | undefined | null;
};

export type RenderFieldExtensionMeta = CommonRenderItemFormMeta & RenderFieldExtensionMetaAdditions;

export type RenderFieldExtensionMethodsAdditions = {
  getSettings: () => Promise<RenderFieldExtensionMeta>;
};

export type RenderFieldExtensionMethods = CommonRenderItemFormMethods &
  RenderFieldExtensionMethodsAdditions;

export type RenderModalMetaAdditions = {
  mode: 'renderModal';
  modal: Modal;
};

export type RenderModalMeta = CommonRenderMeta & RenderModalMetaAdditions;

export type RenderModalMethodsAdditions = {
  getSettings: () => Promise<RenderModalMeta>;
  resolve: (returnValue: unknown) => void;
};

export type RenderModalMethods = CommonRenderMethods & RenderModalMethodsAdditions;

export type RenderPageMetaAdditions = {
  mode: 'renderPage';
  pageId: string;
};

export type RenderPageMeta = CommonRenderMeta & RenderPageMetaAdditions;

export type RenderPageMethodsAdditions = {
  getSettings: () => Promise<RenderPageMeta>;
};

export type RenderPageMethods = CommonRenderMethods & RenderPageMethodsAdditions;

export type RenderDashboardWidgetMetaAdditions = {
  mode: 'renderDashboardWidget';
  dashboardWidget: DashboardWidget;
};

export type RenderDashboardWidgetMeta = CommonRenderMeta & RenderDashboardWidgetMetaAdditions;

export type RenderDashboardWidgetMethodsAdditions = {
  getSettings: () => Promise<RenderDashboardWidgetMeta>;
};

export type RenderDashboardWidgetMethods = CommonRenderMethods &
  RenderDashboardWidgetMethodsAdditions;

export type RenderFieldExtensionConfigMetaAdditions = {
  mode: 'renderFieldExtensionConfig';
  fieldExtension: FieldExtension;
};

export type RenderFieldExtensionConfigMeta = CommonRenderMeta &
  RenderFieldExtensionConfigMetaAdditions;

export type RenderFieldExtensionConfigMethodsAdditions = {
  getSettings: () => Promise<RenderFieldExtensionConfigMeta>;
  save: (params: Record<string, unknown>) => Promise<void>;
};

export type RenderFieldExtensionConfigMethods = CommonRenderMethods &
  RenderFieldExtensionConfigMethodsAdditions;

export type RenderConfigMetaAdditions = {
  mode: 'renderConfig';
};

export type RenderConfigMeta = CommonRenderMeta & RenderConfigMetaAdditions;

export type RenderConfigMethodsAdditions = {
  getSettings: () => Promise<RenderConfigMeta>;
  save: (params: Record<string, unknown>) => Promise<void>;
};

export type RenderConfigMethods = CommonRenderMethods & RenderConfigMethodsAdditions;

export type FieldSetupMetaAdditions = {
  mode: 'init';
  itemType: ModelBlock;
};

export type FieldSetupMeta = InitMeta & FieldSetupMetaAdditions;

export type RenderAssetSourceMetaAdditions = {
  mode: 'renderAssetSource';
  assetSource: AssetSource;
};

export type RenderAssetSourceMeta = CommonRenderMeta & RenderAssetSourceMetaAdditions;

export type RenderAssetSourceMethodsAdditions = {
  getSettings: () => Promise<RenderAssetSourceMeta>;
  resolve: (returnValue: unknown) => void;
};

export type RenderAssetSourceMethods = CommonRenderMethods & RenderAssetSourceMethodsAdditions;
