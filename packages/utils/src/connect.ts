import Penpal from 'penpal';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import {
  Account,
  Field,
  Item,
  ModelBlock,
  Plugin,
  Role,
  Site,
  SsoUser,
  Upload,
  User,
} from './SiteApiSchema';

export type InitPhaseContext = {
  site: Site;
  environment: string | null;
  itemTypes: Partial<Record<string, ModelBlock>>;
  currentUser: User | SsoUser | Account;
  currentUserRole: Role;
  plugin: Plugin;
};

export type WidgetDeclaration = {
  id: string;
  label: string;
  invocationParams: Record<string, unknown>;
};

export type NavigationPageDeclaration = {
  id: string;
  label: string;
  icon: string;
  invocationParams: Record<string, unknown>;
};

export type AdminPageGroupDeclaration = {
  id: string;
  label: string;
};

export type AdminPageDeclaration = {
  id: string;
  label: string;
  icon: string;
  group: string;
  invocationParams: Record<string, unknown>;
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

export type ManualFieldExtensionDeclaration = {
  id: string;
  name: string;
  type: FieldExtensionType;
  fieldTypes: FieldType[];
  configurable: boolean;
};

export type SidebarPaneDeclaration = {
  id: string;
  label: string;
  invocationParams: Record<string, unknown>;
};

export type FieldSetupPhaseContext = InitPhaseContext & {
  itemType: ModelBlock;
};

export type FieldExtensionOverrideDeclaration = {
  editor?: {
    id: string;
    type: 'field_editor' | 'sidebar';
    invocationParams: Record<string, unknown>;
  };
  addons?: Array<{ id: string; invocationParams: Record<string, unknown> }>;
};

export type AssetSourceDefinition = {
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

type FocalPoint = {
  x: number;
  y: number;
};

export type FileFieldValue = {
  upload_id: string;
  alt: string | null;
  title: string | null;
  focal_point: FocalPoint | null;
  custom_data: Record<string, string>;
};

export type ModalDefinition = {
  title?: string;
  closeDisabled: boolean;
  width: 's' | 'm' | 'l' | 'xl' | 'fullWidth' | number;
  invocationParams: Record<string, unknown>;
};

type ConfirmChoice = {
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

export type BaseRenderContext = InitPhaseContext & {
  fields: Partial<Record<string, Field>>;
  users: Partial<Record<string, User>>;
  ssoUsers: Partial<Record<string, SsoUser>>;
  account: Account;
  theme: Theme;

  startAutoResizer: () => void;
  stopAutoResizer: () => void;
  addChangeListener: (path: string, callback: () => void) => RemoveListenerFn;
  updateHeight: (newHeight?: number) => Promise<void>;

  navigateTo: (path: string) => Promise<void>;
  loadItemTypeFields: (itemTypeId: string) => Promise<void>;
  createNewItem: (itemTypeId: string) => Promise<Item | null>;
  selectItem:
    | ((
        itemTypeId: string,
        options: { multiple: true },
      ) => Promise<Item[] | null>)
    | ((
        itemTypeId: string,
        options?: { multiple: false },
      ) => Promise<Item | null>);
  editItem: (itemId: string) => Promise<Item | null>;
  notice: (message: string) => Promise<void>;
  alert: (message: string) => Promise<void>;
  selectUpload:
    | ((options: { multiple: true }) => Promise<Upload[] | null>)
    | ((options?: { multiple: false }) => Promise<Upload | null>);
  editUpload: (uploadId: string) => Promise<Upload | null>;
  editUploadMetadata: (
    fileFieldValue: FileFieldValue,
  ) => Promise<FileFieldValue | null>;
  openModal: (modal: ModalDefinition) => Promise<unknown>;
  openConfirm: (options: ConfirmOptions) => Promise<unknown>;
};

export type ModalRenderContext = BaseRenderContext & {
  resolve: (returnValue: unknown) => void;
};

type RemoveListenerFn = () => void;

export type ItemFormRenderContext = BaseRenderContext & {
  locale: string;
  placeholder: string;
  disabled: boolean;
  itemId: string | null;
  itemStatus: 'draft' | 'updated' | 'published';
  itemValue: Record<string, unknown>;
  isSubmitting: boolean;
  isFormDirty: boolean;
  itemType: ModelBlock;
  fieldPath: string;

  addFieldChangeListener: (
    path: string,
    callback: () => void,
  ) => RemoveListenerFn;
  toggleField: (path: string, show: boolean) => Promise<void>;
  disableField: (path: string, disable: boolean) => Promise<void>;
  scrollToField: (path: string, locale?: string) => Promise<void>;
  setFieldValue: (path: string, value: unknown) => Promise<void>;
  saveCurrentItem: () => Promise<void>;
};

export type FieldExtensionRenderContext = ItemFormRenderContext & {
  field: Field;
  parentField: Field;
  invocationParams: Record<string, unknown>;
};

export type FieldExtensionConfigRenderContext = FieldExtensionRenderContext & {
  save: (params: Record<string, unknown>) => Promise<void>;
};

export type ConfigRenderContext = BaseRenderContext & {
  save: (params: Record<string, unknown>) => Promise<void>;
};

export type FullConfiguration = {
  dashboardWidgets: (context: InitPhaseContext) => WidgetDeclaration[];
  mainNavigationPages: (
    context: InitPhaseContext,
  ) => NavigationPageDeclaration[];
  adminPageGroups: (context: InitPhaseContext) => AdminPageGroupDeclaration[];
  adminPages: (context: InitPhaseContext) => AdminPageDeclaration[];
  manualFieldExtensions: (
    context: InitPhaseContext,
  ) => ManualFieldExtensionDeclaration[];
  itemTypeSidebarPanes: (
    itemType: ModelBlock,
    context: InitPhaseContext,
  ) => SidebarPaneDeclaration[];
  overrideFieldExtensions: (
    field: Field,
    context: FieldSetupPhaseContext,
  ) => FieldExtensionOverrideDeclaration | undefined;
  assetSources: (
    field: Field,
    context: FieldSetupPhaseContext,
  ) => AssetSourceDefinition[];
  renderDashboardWidget: (
    dashboardWidget: WidgetDeclaration,
    context: BaseRenderContext,
  ) => void;
  renderConfig: (context: ConfigRenderContext) => void;
  renderAssetSource: (
    assetSource: AssetSourceDefinition,
    context: BaseRenderContext,
  ) => void;
  renderPage: (
    page: AdminPageGroupDeclaration | NavigationPageDeclaration,
    context: BaseRenderContext,
  ) => void;
  renderModal: (modal: ModalDefinition, context: ModalRenderContext) => void;
  renderSidebarPane: (
    sidebar: SidebarPaneDeclaration,
    context: ItemFormRenderContext,
  ) => void;
  renderFieldExtension: (
    extension: ManualFieldExtensionDeclaration,
    context: FieldExtensionRenderContext,
  ) => void;
  renderFieldExtensionConfig: (
    extension: ManualFieldExtensionDeclaration,
    context: FieldExtensionConfigRenderContext,
  ) => void;
};
