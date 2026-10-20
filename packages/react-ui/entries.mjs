// The public entries of react-ui. A key is the subpath that a plugin
// imports (`datocms-react-ui/Button`). A value is the module that the entry
// exposes: a specifier of the `exports` map of ui, or a file of the adapter
// in `src/` of react-ui (`adapter`). With `only`, the
// entry exposes only these names of the module.

export const entries = {
  // The adapter: the root of a plugin and the inspector of ctx
  Canvas: { adapter: 'src/Canvas.tsx' },
  // Its own entry: only this entry imports the manifest of the SDK at run
  // time, thus a plugin without it does not bundle the manifest.
  ContextInspector: { adapter: 'src/ContextInspector.tsx' },

  // Layout
  Page: 'ui/Page',
  Pane: 'ui/Pane',
  ListOrOverview: 'ui/ListOrOverview',
  SplitPane: 'ui/SplitPane',
  SidebarPanel: 'ui/SidebarPanel',
  Toolbar: 'ui/Toolbar',

  // Navigation
  Link: 'ui/Link',
  Tabs: 'ui/Tabs',
  SegmentedControl: 'ui/SegmentedControl',
  SidebarTree: 'ui/SidebarTree',
  NavList: 'ui/NavList',
  SettingsMenu: 'ui/SettingsMenu',
  Chevron: 'ui/Chevron',

  // Actions
  Button: 'ui/Button',
  Dropdown: 'ui/Dropdown',
  'Dropdown/triggers/ButtonTrigger': 'ui/Dropdown/triggers/ButtonTrigger',
  'Dropdown/triggers/DropdownTriggerButton':
    'ui/Dropdown/triggers/DropdownTriggerButton',
  'Dropdown/triggers/IconTrigger': 'ui/Dropdown/triggers/IconTrigger',
  'Dropdown/triggers/PillTrigger': 'ui/Dropdown/triggers/PillTrigger',
  'Dropdown/triggers/TextualTrigger': 'ui/Dropdown/triggers/TextualTrigger',
  'Dropdown/triggers/types': 'ui/Dropdown/triggers/types',
  EditorToolbar: 'ui/EditorToolbar',
  HotKey: 'ui/HotKey',
  MultipleSelectionActionBar: 'ui/MultipleSelectionActionBar',
  SplitButton: 'ui/SplitButton',

  // Forms
  AutosizeInput: 'ui/form/AutosizeInput',
  DebouncedTextInput: 'ui/form/DebouncedTextInput',
  FieldHint: 'ui/form/FieldHint',
  FieldWrapper: 'ui/form/FieldWrapper',
  InputGroup: 'ui/form/InputGroup',
  KeyValueList: 'ui/form/KeyValueList',
  Label: 'ui/form/Label',
  NumberInput: 'ui/form/NumberInput',
  PasswordInput: 'ui/form/PasswordInput',
  RadioGroupInput: 'ui/form/RadioGroupInput',
  SelectInput: 'ui/form/SelectInput',
  StringInput: 'ui/form/StringInput',
  SwitchInput: 'ui/form/SwitchInput',
  SwitchList: 'ui/form/SwitchList',
  TableList: 'ui/form/TableList',
  TextareaInput: 'ui/form/TextareaInput',

  // Lists
  Table: 'ui/Table',
  'Table/cells/IconCell': 'ui/Table/cells/IconCell',
  'Table/cells/LinkCell': 'ui/Table/cells/LinkCell',
  'Table/cells/StatusCell': 'ui/Table/cells/StatusCell',
  'Table/cells/TimeCell': 'ui/Table/cells/TimeCell',
  RowList: 'ui/RowList',
  EntityRow: 'ui/EntityRow',
  EntitySummary: 'ui/EntitySummary',
  InfoList: 'ui/InfoList',
  CardList: 'ui/CardList',
  SettingsList: 'ui/SettingsList',
  ListArea: 'ui/ListArea',
  EmptySlot: 'ui/EmptySlot',
  InsertGap: 'ui/InsertGap',
  MediaCard: 'ui/MediaCard',
  dnd: 'ui/dnd',

  // Content
  Pill: 'ui/Pill',
  FeedbackDot: 'ui/FeedbackDot',
  SmartDate: 'ui/SmartDate',
  CopyableValue: 'ui/CopyableValue',
  CopyableId: 'ui/CopyableId',
  CopyButton: 'ui/CopyButton',
  IdText: 'ui/IdText',
  CodeSnippet: 'ui/CodeSnippet',
  Avatar: 'ui/Avatar',
  InitialsAvatar: 'ui/InitialsAvatar',
  FramedImage: 'ui/FramedImage',
  ValidityTriangles: 'ui/ValidityTriangles',
  UploadThreatTriangle: 'ui/UploadThreatTriangle',
  ApiKey: 'ui/ApiKey',
  UsageMeter: 'ui/UsageMeter',
  // DateSettingsProvider does not ship: Canvas mounts it.
  DateSettings: {
    module: 'ui/DateSettings',
    only: { values: ['useDateSettings'], types: ['DateSettings'] },
  },

  // Feedback
  Callout: 'ui/Callout',
  BlankSlate: 'ui/BlankSlate',
  ProgressBar: 'ui/ProgressBar',
  Spinner: 'ui/Spinner',

  // Overlays
  Tooltip: 'ui/Tooltip',
  HoverCard: 'ui/HoverCard',
  Popover: 'ui/Popover',
  Portal: 'ui/Portal',
  Modal: 'ui/Modal',
  FullscreenModal: 'ui/FullscreenModal',
  NewZIndex: 'ui/NewZIndex',

  // Patterns
  ListDetail: 'ui/ListDetail',
  ListFormPage: 'ui/ListFormPage',

  // Semantic
  Main: 'ui/Main',
  Nav: 'ui/Nav',
  Aside: 'ui/Aside',
  Search: 'ui/Search',
  Heading: 'ui/Heading',
  RawButton: 'ui/RawButton',

  // The types of the text props
  Message: 'ui/Message',

  // Hooks
  'hooks/useAsyncSelectOptions': 'ui/hooks/useAsyncSelectOptions',
  'hooks/useClickOutside': 'ui/hooks/useClickOutside',
  'hooks/useCopyToClipboard': 'ui/hooks/useCopyToClipboard',
  'hooks/useDebouncedCallback': 'ui/hooks/useDebouncedCallback',
  'hooks/useDebouncedValue': 'ui/hooks/useDebouncedValue',
  'hooks/useDebounceOnBoolean': 'ui/hooks/useDebounceOnBoolean',
  'hooks/useDeepCompareEffect': 'ui/hooks/useDeepCompareEffect',
  'hooks/useDidUpdateEffect': 'ui/hooks/useDidUpdateEffect',
  'hooks/useElementLayout': 'ui/hooks/useElementLayout',
  'hooks/useMediaQuery': 'ui/hooks/useMediaQuery',
  'hooks/useRovingKeyDown': 'ui/hooks/useRovingKeyDown',
  'hooks/useShallowEqual': 'ui/hooks/useShallowEqual',
  'hooks/useSmartRowClick': 'ui/hooks/useSmartRowClick',

  // Utils
  'utils/formatDate': 'ui/utils/formatDate',

  // The providers that Canvas mounts. They are in the output but not
  // public: the `exports` map of package.json blocks `./internal/*`. The
  // smoke test of a host without Canvas uses them.
  'internal/BundledTexts': 'ui/BundledTexts',
  'internal/TextsProvider': 'ui/TextsProvider',
  'internal/DateSettings': 'ui/DateSettings',
  'internal/NavigationProvider': 'ui/NavigationProvider',
};

// The packages that must never be in the output: ui-app, and the Formik
// layer, the texts and the router of the apps. ui never imports them (a Biome
// rule of packages/ui), thus this check finds a mistake of the build.
export const forbiddenPackages = [
  'ui-app',
  'formik',
  'i18next',
  'react-i18next',
  'i18next-icu',
  'react-router',
  'react-router-dom',
  'history',
];
