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

export type { Account, Field, Item, ModelBlock, Plugin, Role, Site, SsoUser, Upload, User };

export type InitCtx = {
  site: Site;
  environment: string | null;
  itemTypes: Partial<Record<string, ModelBlock>>;
  currentUser: User | SsoUser | Account;
  currentUserRole: Role;
  plugin: Plugin;
};

export type FieldSetupCtx = InitCtx & {
  itemType: ModelBlock;
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

export type Modal = {
  title?: string;
  closeDisabled?: boolean;
  width?: 's' | 'm' | 'l' | 'xl' | 'fullWidth' | number;
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

export type RenderCtx = InitCtx & {
  fields: Partial<Record<string, Field>>;
  users: Partial<Record<string, User>>;
  ssoUsers: Partial<Record<string, SsoUser>>;
  account: Account;
  theme: Theme;
};

export type RenderMethods = {
  navigateTo: (path: string) => Promise<void>;
  loadItemTypeFields: (itemTypeId: string) => Promise<void>;
  createNewItem: (itemTypeId: string) => Promise<Item | null>;
  selectItem:
    | ((itemTypeId: string, options: { multiple: true }) => Promise<Item[] | null>)
    | ((itemTypeId: string, options?: { multiple: false }) => Promise<Item | null>);
  editItem: (itemId: string) => Promise<Item | null>;
  notice: (message: string) => Promise<void>;
  alert: (message: string) => Promise<void>;
  selectUpload:
    | ((options: { multiple: true }) => Promise<Upload[] | null>)
    | ((options?: { multiple: false }) => Promise<Upload | null>);
  editUpload: (uploadId: string) => Promise<Upload | null>;
  editUploadMetadata: (fileFieldValue: FileFieldValue) => Promise<FileFieldValue | null>;
  openModal: (modal: Modal) => Promise<unknown>;
  openConfirm: (options: ConfirmOptions) => Promise<unknown>;
};

export type ModalRenderMethods = RenderMethods & {
  resolve: (returnValue: unknown) => void;
};

export type ItemFormRenderCtx = RenderCtx & {
  locale: string;
  disabled: boolean;
  itemId: string | null;
  itemStatus: 'draft' | 'updated' | 'published';
  itemValue: Record<string, unknown>;
  isSubmitting: boolean;
  isFormDirty: boolean;
  itemType: ModelBlock;
};

export type ItemFormRenderMethods = RenderMethods & {
  toggleField: (path: string, show: boolean) => Promise<void>;
  disableField: (path: string, disable: boolean) => Promise<void>;
  scrollToField: (path: string, locale?: string) => Promise<void>;
  setFieldValue: (path: string, value: unknown) => Promise<void>;
  saveCurrentItem: () => Promise<void>;
};

export type FieldExtensionRenderCtx = ItemFormRenderCtx & {
  placeholder: string;
  fieldPath: string;
  field: Field;
  parentField: Field;
  invocationParams: Record<string, unknown>;
};

export type FieldExtensionConfigRenderMethods = RenderMethods & {
  save: (params: Record<string, unknown>) => Promise<void>;
};

export type ConfigRenderMethods = RenderMethods & {
  save: (params: Record<string, unknown>) => Promise<void>;
};
