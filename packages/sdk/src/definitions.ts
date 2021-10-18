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
  invocationParams: Record<string, unknown>;
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

export type Foo = 'bar';
