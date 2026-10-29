// The public entries of react-ui. A key is the subpath that a plugin
// imports (`datocms-react-ui/Button`). A value is the module that the entry
// exposes: a specifier of the `exports` map of ui-public, or a file of the adapter
// in `src/` of react-ui (`adapter`). With `only`, the
// entry exposes only these names of the module.

export const entries = {
  // The adapter: the root of a plugin and the inspector of ctx
  Canvas: { adapter: 'src/Canvas.tsx' },
  // Its own entry: only this entry imports the manifest of the SDK at run
  // time, thus a plugin without it does not bundle the manifest.
  ContextInspector: { adapter: 'src/ContextInspector.tsx' },

  // Layout
  Page: 'ui-public/Page',
  Pane: 'ui-public/Pane',
  ListOrOverview: 'ui-public/ListOrOverview',
  SplitPane: 'ui-public/SplitPane',
  SidebarPanel: 'ui-public/SidebarPanel',
  Toolbar: 'ui-public/Toolbar',

  // Navigation
  Link: 'ui-public/Link',
  Tabs: 'ui-public/Tabs',
  SegmentedControl: 'ui-public/SegmentedControl',
  SidebarTree: 'ui-public/SidebarTree',
  NavList: 'ui-public/NavList',
  SettingsMenu: 'ui-public/SettingsMenu',
  Chevron: 'ui-public/Chevron',

  // Actions
  Button: 'ui-public/Button',
  Dropdown: 'ui-public/Dropdown',
  'Dropdown/triggers/ButtonTrigger':
    'ui-public/Dropdown/triggers/ButtonTrigger',
  'Dropdown/triggers/DropdownTriggerButton':
    'ui-public/Dropdown/triggers/DropdownTriggerButton',
  'Dropdown/triggers/IconTrigger': 'ui-public/Dropdown/triggers/IconTrigger',
  'Dropdown/triggers/PillTrigger': 'ui-public/Dropdown/triggers/PillTrigger',
  'Dropdown/triggers/TextualTrigger':
    'ui-public/Dropdown/triggers/TextualTrigger',
  'Dropdown/triggers/types': 'ui-public/Dropdown/triggers/types',
  EditorToolbar: 'ui-public/EditorToolbar',
  Actions: 'ui-public/Actions',
  MultipleSelectionActionBar: 'ui-public/MultipleSelectionActionBar',
  SplitButton: 'ui-public/SplitButton',

  // Forms
  AutosizeInput: 'ui-public/form/AutosizeInput',
  DebouncedTextInput: 'ui-public/form/DebouncedTextInput',
  FieldHint: 'ui-public/form/FieldHint',
  FieldWrapper: 'ui-public/form/FieldWrapper',
  InputGroup: 'ui-public/form/InputGroup',
  KeyValueList: 'ui-public/form/KeyValueList',
  Label: 'ui-public/form/Label',
  NumberInput: 'ui-public/form/NumberInput',
  PasswordInput: 'ui-public/form/PasswordInput',
  RadioGroupInput: 'ui-public/form/RadioGroupInput',
  SelectInput: 'ui-public/form/SelectInput',
  StringInput: 'ui-public/form/StringInput',
  SwitchInput: 'ui-public/form/SwitchInput',
  SwitchList: 'ui-public/form/SwitchList',
  TableList: 'ui-public/form/TableList',
  TextareaInput: 'ui-public/form/TextareaInput',

  // Lists
  Table: 'ui-public/Table',
  'Table/cells/EntityCell': 'ui-public/Table/cells/EntityCell',
  'Table/cells/IconCell': 'ui-public/Table/cells/IconCell',
  'Table/cells/LinkCell': 'ui-public/Table/cells/LinkCell',
  'Table/cells/StatusCell': 'ui-public/Table/cells/StatusCell',
  'Table/cells/TimeCell': 'ui-public/Table/cells/TimeCell',
  RowList: 'ui-public/RowList',
  EntityRow: 'ui-public/EntityRow',
  EntitySummary: 'ui-public/EntitySummary',
  InfoList: 'ui-public/InfoList',
  CardList: 'ui-public/CardList',
  SettingsList: 'ui-public/SettingsList',
  ListArea: 'ui-public/ListArea',
  EmptySlot: 'ui-public/EmptySlot',
  InsertGap: 'ui-public/InsertGap',
  MediaCard: 'ui-public/MediaCard',
  UploadCard: 'ui-public/UploadCard',
  dnd: 'ui-public/dnd',
  TreeRow: 'ui-public/TreeRow',

  // Content
  Pill: 'ui-public/Pill',
  EnvironmentPill: 'ui-public/EnvironmentPill',
  ItemStatus: 'ui-public/ItemStatus',
  FeedbackDot: 'ui-public/FeedbackDot',
  SmartDate: 'ui-public/SmartDate',
  CopyableValue: 'ui-public/CopyableValue',
  CopyableId: 'ui-public/CopyableId',
  CopyButton: 'ui-public/CopyButton',
  IdText: 'ui-public/IdText',
  CodeSnippet: 'ui-public/CodeSnippet',
  Avatar: 'ui-public/Avatar',
  InitialsAvatar: 'ui-public/InitialsAvatar',
  IconAvatar: 'ui-public/IconAvatar',
  FramedImage: 'ui-public/FramedImage',
  UploadPreview: 'ui-public/UploadPreview',
  FileTypeIcon: 'ui-public/FileTypeIcon',
  ValidityTriangles: 'ui-public/ValidityTriangles',
  UploadThreatTriangle: 'ui-public/UploadThreatTriangle',
  ApiKey: 'ui-public/ApiKey',
  UsageMeter: 'ui-public/UsageMeter',
  // DateSettingsProvider does not ship: Canvas mounts it.
  DateSettings: {
    module: 'ui-public/DateSettings',
    only: { values: ['useDateSettings'], types: ['DateSettings'] },
  },

  // Feedback
  Callout: 'ui-public/Callout',
  BlankSlate: 'ui-public/BlankSlate',
  ProgressBar: 'ui-public/ProgressBar',
  Spinner: 'ui-public/Spinner',

  // Overlays
  Tooltip: 'ui-public/Tooltip',
  HoverCard: 'ui-public/HoverCard',
  Popover: 'ui-public/Popover',
  Portal: 'ui-public/Portal',
  Modal: 'ui-public/Modal',
  FullscreenModal: 'ui-public/FullscreenModal',
  NewZIndex: 'ui-public/NewZIndex',

  // Patterns
  ListDetail: 'ui-public/ListDetail',
  ListFormPage: 'ui-public/ListFormPage',

  // Semantic
  Main: 'ui-public/Main',
  Nav: 'ui-public/Nav',
  Aside: 'ui-public/Aside',
  Search: 'ui-public/Search',
  Heading: 'ui-public/Heading',
  RawButton: 'ui-public/RawButton',

  // The types of the text props
  Message: 'ui-public/Message',

  // Hooks
  'hooks/useAsyncSelectOptions': 'ui-public/hooks/useAsyncSelectOptions',
  'hooks/useClickOutside': 'ui-public/hooks/useClickOutside',
  'hooks/useCopyToClipboard': 'ui-public/hooks/useCopyToClipboard',
  'hooks/useDebouncedCallback': 'ui-public/hooks/useDebouncedCallback',
  'hooks/useDebouncedValue': 'ui-public/hooks/useDebouncedValue',
  'hooks/useDebounceOnBoolean': 'ui-public/hooks/useDebounceOnBoolean',
  'hooks/useDeepCompareEffect': 'ui-public/hooks/useDeepCompareEffect',
  'hooks/useDidUpdateEffect': 'ui-public/hooks/useDidUpdateEffect',
  'hooks/useElementLayout': 'ui-public/hooks/useElementLayout',
  'hooks/useMediaQuery': 'ui-public/hooks/useMediaQuery',
  'hooks/useRovingKeyDown': 'ui-public/hooks/useRovingKeyDown',
  'hooks/useShallowEqual': 'ui-public/hooks/useShallowEqual',
  'hooks/useSmartRowClick': 'ui-public/hooks/useSmartRowClick',

  // Utils
  'utils/formatDate': 'ui-public/utils/formatDate',

  // The providers that Canvas mounts. They are in the output but not
  // public: the `exports` map of package.json blocks `./internal/*`. The
  // smoke test of a host without Canvas uses them.
  'internal/BundledTexts': 'ui-public/BundledTexts',
  'internal/TextsProvider': 'ui-public/TextsProvider',
  'internal/DateSettings': 'ui-public/DateSettings',
  'internal/NavigationProvider': 'ui-public/NavigationProvider',
};

// The packages that must never be in the output: ui-static, ui-apps, and the Formik
// layer, the texts and the router of the apps. ui-public never imports them (a Biome
// rule of packages/ui-public), thus this check finds a mistake of the build.
export const forbiddenPackages = [
  'ui-static',
  'ui-apps',
  'formik',
  'i18next',
  'react-i18next',
  'i18next-icu',
  'react-router',
  'react-router-dom',
  'history',
];
