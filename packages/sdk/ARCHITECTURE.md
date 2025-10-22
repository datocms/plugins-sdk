# DatoCMS Plugin SDK - Architecture

## Overview

The `datocms-plugin-sdk` is a TypeScript SDK that enables developers to build plugins for DatoCMS. These plugins run as **iframes embedded within the DatoCMS Studio** (the content management interface), and can extend its functionality by:

- Adding custom UI components (sidebar panels, field editors, pages)
- Reacting to events (before save, on boot, etc.)
- Customizing dropdown actions and navigation menus
- Integrating external services and workflows

The SDK provides a **hook-based architecture** where plugins implement specific named functions to add capabilities, combined with a **rich context object** that provides access to project data and methods for interacting with the CMS.

## Core Architecture

### Plugin-CMS Communication Model

Plugins run in an **isolated iframe** separate from the main DatoCMS Studio application. Communication between the plugin iframe and the parent CMS window happens through [Penpal](https://github.com/Aaronius/penpal), a library that provides promise-based RPC communication between iframes and their parent windows.

```
┌─────────────────────────────────────────────┐
│         DatoCMS Studio (Parent)             │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │     Plugin Iframe                     │  │
│  │                                       │  │
│  │  connect() ──┐                        │  │
│  │              │                        │  │
│  │              ▼                        │  │
│  │     ┌─────────────────┐               │  │
│  │     │ Penpal RPC      │               │  │
│  │     │ Bidirectional   │               │  │
│  │     │ Communication   │               │  │
│  │     └─────────────────┘               │  │
│  │              │                        │  │
│  │              ▼                        │  │
│  │    Hook implementations               │  │
│  │    (renderFieldExtension, etc.)       │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

The communication flow:

1. **Plugin → CMS**: Plugin exposes hooks as callable methods
2. **CMS → Plugin**: CMS invokes hooks when needed, passing a context object
3. **Plugin → CMS**: Plugin can call CMS methods (open dialogs, navigate, etc.)

### The `connect()` Function

The entry point for every plugin is the `connect()` function (src/connect.ts:129). This function:

1. **Establishes the Penpal connection** to the parent window
2. **Registers hook implementations** provided by the plugin developer
3. **Exposes them as callable methods** to the CMS
4. **Sets up bootstrappers** for render hooks that need continuous re-rendering

```typescript
import { connect } from 'datocms-plugin-sdk';

connect({
  // Declaration hook: returns configuration
  itemFormSidebarPanels(ctx) {
    return [
      { id: 'metrics', label: 'Metrics' }
    ];
  },

  // Render hook: renders UI in iframe
  renderItemFormSidebarPanel(sidebarPanelId, ctx) {
    ReactDOM.render(<MySidebarPanel ctx={ctx} />, document.getElementById('root'));
  },

  // Event hook: reacts to lifecycle events
  onBeforeItemUpsert(item, ctx) {
    // Validate or transform the item before saving
    return item;
  },
});
```

Key implementation details (src/connect.ts:158-201):

```typescript
const penpalConnection = connectToParent({
  methods: {
    sdkVersion: () => '0.3.0',
    implementedHooks: () => Object.keys(configuration).reduce(...),

    // Non-render hooks are directly exposed as Penpal methods
    ...Object.entries(configuration).filter(
      ([key]) => !key.startsWith('render')
    ),

    // For render hooks, CMS will call onChange() or callMethodMergingBootCtx()
    onChange(newSettings) { /* ... */ },
    callMethodMergingBootCtx(methodName, methodArgs, extraCtx) { /* ... */ },
  },
});
```

## The Hook System

The SDK provides **40+ hooks** that plugins can implement. Each hook serves a specific purpose and is called at specific moments by the CMS.

### Hook Categories

#### 1. Declaration Hooks

These hooks **return configuration objects** that tell the CMS what UI elements to add or what behaviors to enable.

Examples:
- `itemFormSidebarPanels`: Declare sidebar panels for record forms
- `mainNavigationTabs`: Add tabs to the top navigation bar
- `manualFieldExtensions`: Register custom field editors
- `fieldDropdownActions`: Add custom actions to field dropdown menus

```typescript
// src/hooks/itemFormSidebarPanels.ts
export type ItemFormSidebarPanelsHook = {
  itemFormSidebarPanels: (ctx: Ctx) => ItemFormSidebarPanel[];
};
```

#### 2. Render Hooks

These hooks **render UI components** inside iframes at specific locations in the DatoCMS interface.

Examples:
- `renderFieldExtension`: Render a custom field editor
- `renderItemFormSidebarPanel`: Render content for a sidebar panel
- `renderPage`: Render a custom page
- `renderModal`: Render a custom modal dialog
- `renderConfigScreen`: Render the plugin configuration form

```typescript
// src/hooks/renderFieldExtension.ts
export type RenderFieldExtensionHook = {
  renderFieldExtension: (
    fieldExtensionId: string,
    ctx: RenderFieldExtensionCtx
  ) => void;
};
```

#### 3. Event/Lifecycle Hooks

These hooks **react to events** or **intercept operations** in the CMS.

Examples:
- `onBoot`: Called when the plugin first loads
- `onBeforeItemUpsert`: Called before saving a record (can modify or validate)
- `onBeforeItemsPublish`: Called before publishing records
- `overrideFieldExtensions`: Programmatically override field appearances
- `buildItemPresentationInfo`: Customize how records appear in lists

```typescript
// src/hooks/onBeforeItemUpsert.ts
export type OnBeforeItemUpsertHook = {
  onBeforeItemUpsert: (
    item: Item,
    ctx: Ctx
  ) => MaybePromise<Item>;
};
```

#### 4. Execute Hooks

These hooks **handle user interactions** with declared dropdown actions.

Examples:
- `executeFieldDropdownAction`: Handle click on a field dropdown action
- `executeItemsDropdownAction`: Handle click on a records dropdown action
- `executeUploadsDropdownAction`: Handle click on an asset dropdown action

```typescript
// src/hooks/executeFieldDropdownAction.ts
export type ExecuteFieldDropdownActionHook = {
  executeFieldDropdownAction: (
    actionId: string,
    ctx: ExecuteFieldDropdownActionCtx
  ) => MaybePromise<void>;
};
```

### Hook Discovery and Metadata

The SDK uses a sophisticated **type introspection system** to generate metadata about all available hooks. This powers documentation, validation, and tooling.

The `generateManifest.ts` script:

1. **Parses the TypeScript AST** of all hook files in `src/hooks/`
2. **Extracts hook signatures**: name, parameters, return types
3. **Captures JSDoc comments**: descriptions, examples, tags
4. **Analyzes context types**: what additional properties/methods each hook provides
5. **Generates `manifest.json`**: A complete map of the SDK's API surface

```typescript
// generateManifest.ts:513
const hooks = hookFiles.map((file) => processFile(file, sharedCtxTypes));

const manifest: Manifest = {
  hooks: Object.fromEntries(hooks.map((hook) => [hook.name, hook])),
  baseCtx: {
    properties: extractGroupsFromTypeInFilePath('src/ctx/base.ts', 'BaseProperties'),
    methods: extractGroupsFromTypeInFilePath('src/ctx/base.ts', 'BaseMethods'),
  },
  // ...
};
```

This manifest enables:
- **Automatic documentation generation** for the DatoCMS docs site
- **Type-safe SDK consumption** with full IntelliSense support
- **Runtime validation** in the CMS when invoking plugin methods

## The Context Object (ctx)

Every hook receives a **context object** (`ctx`) as its last argument. This object provides:

1. **Information** about the project, user, and current state
2. **Methods** for interacting with the CMS (open dialogs, show toasts, navigate, etc.)
3. **Hook-specific data** relevant to the current operation

### Base Context Structure

The base context type is `Ctx<AdditionalProperties, AdditionalMethods>` (src/ctx/base.ts:16):

```typescript
export type Ctx<
  AdditionalProperties extends Record<string, unknown> = {},
  AdditionalMethods extends Record<string, unknown> = {},
> = BaseProperties & AdditionalProperties & BaseMethods & AdditionalMethods;
```

#### Base Properties (src/ctx/base.ts:21-126)

Information available in every context:

**Authentication & User**:
- `currentUser`: The logged-in user (User | SsoUser | Account | Organization)
- `currentRole`: The user's role with permissions
- `currentUserAccessToken`: API token (if permission granted)

**Project Information**:
- `site`: The DatoCMS project
- `environment`: Current environment name
- `owner`: Project owner (Account | Organization)
- `ui.locale`: User's preferred interface language
- `theme`: UI theme colors

**Entity Repositories** (indexed by ID):
- `itemTypes`: All models in the project
- `fields`: Currently loaded fields
- `fieldsets`: Currently loaded fieldsets
- `users`: Currently loaded regular users
- `ssoUsers`: Currently loaded SSO users

**Plugin Configuration**:
- `plugin`: The plugin object with `plugin.attributes.parameters` (saved settings)

#### Base Methods (src/ctx/base.ts:137-613)

Methods available in every context:

**Loading Data**:
- `loadItemTypeFields(itemTypeId)`: Load all fields for a model
- `loadFieldsUsingPlugin()`: Load fields using this plugin
- `loadUsers()`, `loadSsoUsers()`: Load user lists

**Plugin Configuration**:
- `updatePluginParameters(params)`: Save plugin settings
- `updateFieldAppearance(fieldId, changes)`: Modify field editor configuration

**Dialogs - Records**:
- `createNewItem(itemTypeId)`: Open create record dialog
- `selectItem(itemTypeId, options)`: Open record picker
- `editItem(itemId)`: Open edit record dialog

**Dialogs - Assets**:
- `selectUpload(options)`: Open asset picker
- `editUpload(uploadId)`: Open edit asset dialog
- `editUploadMetadata(fileFieldValue)`: Edit asset metadata

**Dialogs - Custom**:
- `openModal(modal)`: Open a custom modal (renders via `renderModal` hook)
- `openConfirm(options)`: Show confirmation dialog

**Notifications**:
- `alert(message)`: Show error toast
- `notice(message)`: Show success toast
- `customToast(toast)`: Show custom toast with optional CTA

**Navigation**:
- `navigateTo(path)`: Navigate to another page in the CMS

### Extended Contexts for Specific Hooks

Different hooks receive **specialized contexts** with additional properties and methods relevant to their purpose.

#### Item Form Contexts

Hooks that deal with record editing receive `ItemFormAdditionalProperties` and `ItemFormAdditionalMethods` (src/ctx/commonExtras/itemForm.ts):

**Additional Properties**:
- `item`: The record being edited (or `null` for new records)
- `itemType`: The model of the record
- `formValues`: Current form field values
- `isFormDirty`: Whether the form has unsaved changes
- `isSubmitting`: Whether the form is currently saving
- `itemStatus`: Publishing status ('draft', 'published', etc.)

**Additional Methods**:
- `setFieldValue(path, value)`: Programmatically set a field value
- `toggleField(path, visible)`: Show/hide a field
- `disableField(path, disable)`: Enable/disable a field
- `scrollToField(path)`: Scroll to a specific field
- `saveCurrentItem()`: Trigger form save

Example usage in `renderFieldExtension`:

```typescript
export type RenderFieldExtensionCtx = SelfResizingPluginFrameCtx<
  'renderFieldExtension',
  ItemFormAdditionalProperties & FieldAdditionalProperties & {
    fieldExtensionId: string;
    parameters: Record<string, unknown>;
  },
  ItemFormAdditionalMethods
>;
```

#### Field Contexts

Hooks related to specific fields also receive `FieldAdditionalProperties` (src/ctx/commonExtras/field.ts):

- `field`: The field where the extension is installed
- `fieldPath`: Path in formValues to the field's value
- `parentField`: If in a block, the parent Modular Content/Structured Text field
- `block`: If in a block, the block ID and model
- `disabled`: Whether the field is disabled

#### Plugin Frame Contexts

Render hooks that run in iframes receive either `SelfResizingPluginFrameCtx` or `ImposedSizePluginFrameCtx` (src/ctx/pluginFrame.ts):

**Common Properties**:
- `mode`: The render hook being called (e.g., 'renderFieldExtension')
- `bodyPadding`: Padding around the iframe content `[top, right, bottom, left]`

**Common Methods**:
- `getSettings()`: Retrieve current context properties (useful for re-renders)

**SelfResizingPluginFrameCtx Additional Methods** (src/ctx/commonExtras/sizing.ts):
- `updateHeight(height?)`: Manually set iframe height
- `startAutoResizer()`: Auto-adjust iframe height to content
- `stopAutoResizer()`: Stop auto-adjusting
- `isAutoResizerActive()`: Check if auto-resizer is running

The auto-resizer uses `ResizeObserver` and `MutationObserver` to continuously monitor DOM changes and update the iframe height accordingly (src/utils.ts:178-253).

## Render Hook Lifecycle

Render hooks have a special lifecycle because they need to **continuously update** as the context changes (e.g., when form values change).

### The Bootstrapper Pattern

Each render hook has an associated **bootstrapper function** that manages its lifecycle (src/utils.ts:105-141):

```typescript
export function containedRenderModeBootstrapper<Ctx>(
  mode: string,
  callConfigurationMethod: (configuration, ctx) => void,
): Bootstrapper {
  return (connectConfiguration, methods, initialProperties) => {
    // Only activate if CMS is in the right mode
    if (initialProperties.mode !== mode) {
      return undefined;
    }

    // Build sizing utilities for self-resizing iframes
    const sizingUtilities = buildSizingUtilities(methods);

    // Render function that merges context and calls the hook
    const render = (properties: Record<string, unknown>) => {
      callConfigurationMethod(connectConfiguration, {
        ...methods,
        ...properties,
        ...sizingUtilities,
      } as Ctx);
    };

    // Initial render
    render(initialProperties);

    // Return render function to be called on context updates
    return render;
  };
}
```

### Communication Flow for Render Hooks

When the CMS needs to render a plugin in a specific mode:

1. **CMS creates an iframe** with the plugin's entry point URL
2. **Plugin calls `connect()`** with hook implementations
3. **Plugin establishes Penpal connection** to parent window (CMS)
4. **Plugin calls `methods.getSettings()`** to retrieve initial context from CMS (src/connect.ts:204)
5. **CMS returns settings object** containing mode, properties, and methods
6. **Bootstrapper activates** if mode matches the render hook (src/connect.ts:271-278)
7. **Bootstrapper calls the render hook** with the full context
8. **Plugin renders** its UI inside the iframe

When context changes (e.g., form values update):

1. **CMS calls `onChange(newSettings)`** on the plugin (src/connect.ts:177-180)
2. **Plugin's `onChange` listener** updates `currentProperties` or invokes bootstrapper's render function
3. **Bootstrapper's render function** is invoked with new properties
4. **Hook is called again** with updated context
5. **Plugin re-renders** with new data

```typescript
// Inside connect() (src/connect.ts:209-211)
onChangeListener = (newProperties) => {
  currentProperties = newProperties;
};

// Later, when bootstrapper runs (src/connect.ts:271-278)
for (const bootstrapper of Object.values(availableBootstrappers)) {
  const result = bootstrapper(configuration, methods, initialProperties);

  if (result) {
    onChangeListener = result;  // The render function
    break;
  }
}
```

## Non-Render Hook Invocation

Non-render hooks (declaration, event, execute hooks) work differently:

### Direct Invocation

Declaration hooks without `ctx` argument are **directly exposed as Penpal methods** (src/connect.ts:172-176):

```typescript
methods: {
  // Directly expose non-render hooks
  ...Object.entries(configuration).filter(
    ([key]) => !key.startsWith('render')
  ),
}
```

The CMS can invoke them directly:

```typescript
// In CMS code
const panels = await pluginConnection.itemFormSidebarPanels();
```

### Context-Merged Invocation

Hooks that end with a `ctx` parameter use a special invocation method called `callMethodMergingBootCtx` (src/connect.ts:182-199):

```typescript
callMethodMergingBootCtx(
  methodName: string,
  methodArgs: unknown[],
  extraCtxProperties: Record<string, unknown>,
  extraCtxMethodKeys: string[],
  methodCallId: string,
) {
  return configuration[methodName](...methodArgs, {
    // Base methods (alert, notice, navigateTo, etc.)
    ...methods,

    // Current properties (plugin, site, currentUser, etc.)
    ...currentProperties,

    // Proxied additional methods
    ...Object.fromEntries(
      extraCtxMethodKeys.map((methodName) => [
        methodName,
        (...args) => methods.callAdditionalCtxMethod(methodCallId, methodName, args)
      ])
    ),

    // Additional properties for this specific hook
    ...extraCtxProperties,
  });
}
```

This allows the CMS to:
1. **Add hook-specific context** without plugins needing to know about it
2. **Provide additional methods** that are proxied back to the CMS
3. **Keep contexts up-to-date** with current state (form values, etc.)

Example from CMS perspective:

```typescript
// In CMS code
const result = await pluginConnection.callMethodMergingBootCtx(
  'executeFieldDropdownAction',
  ['my-action-id'],  // Regular arguments
  {
    // Additional context properties
    field: currentField,
    actionId: 'my-action-id',
  },
  ['setFieldValue', 'scrollToField'],  // Additional methods to proxy
  'call-123',  // Unique call ID for method proxying
);
```

## Module Structure

### Core Modules

- **`src/index.ts`**: Main entry point, re-exports everything
- **`src/connect.ts`**: Connection logic, Penpal setup, hook registration
- **`src/utils.ts`**: Bootstrapper factories, helper functions

### Context Definitions

- **`src/ctx/base.ts`**: Base context types (`Ctx`, `BaseProperties`, `BaseMethods`)
- **`src/ctx/pluginFrame.ts`**: Plugin frame context types for render hooks
- **`src/ctx/commonExtras/`**: Reusable context extensions
  - `field.ts`: Field-specific properties
  - `itemForm.ts`: Record form properties and methods
  - `sizing.ts`: Iframe sizing utilities

### Hook Definitions

- **`src/hooks/`**: Individual hook type definitions (one file per hook)
  - Each exports a hook type interface (e.g., `RenderFieldExtensionHook`)
  - Render hooks also export a bootstrapper function
  - Hook files are named after the hook (e.g., `renderFieldExtension.ts`)

### Type System

- **`src/manifestTypes.ts`**: Types for the manifest structure
- **`src/manifest.ts`**: Auto-generated manifest (DO NOT EDIT MANUALLY)
- **`src/shared.ts`**: Shared types (DropdownAction, etc.)
- **`src/icon.ts`**: Icon type definitions
- **`src/guardUtils.ts`**: Type guard utilities

### Build System

- **`generateManifest.ts`**: TypeScript AST parser that generates manifest
- **`tsconfig.json`**: Outputs CommonJS to `dist/cjs/`
- **`tsconfig.esnext.json`**: Outputs ESM to `dist/esm/`
- Types output to `dist/types/`

Build command (package.json:31):
```bash
npm run build
# Runs: generateManifest.ts → tsc (CJS) → tsc (ESM)
```

## Type Safety and Validation

The SDK provides **full TypeScript support** with comprehensive type definitions for:

1. **Hook signatures**: Parameters and return types
2. **Context objects**: All properties and methods with JSDoc documentation
3. **Configuration objects**: Dropdown actions, sidebar panels, etc.

Plugin developers get:
- **IntelliSense** in their IDE
- **Compile-time type checking**
- **Inline documentation** from JSDoc comments

Example of rich types:

```typescript
// From src/hooks/itemFormSidebarPanels.ts
export type ItemFormSidebarPanel = {
  /** Unique ID for the sidebar panel */
  id: string;
  /** Label to show in the sidebar */
  label: string;
  /**
   * Actions will be displayed by ascending `rank`. If you want to specify an
   * explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
  /** Icon to show alongside the label */
  icon?: Icon;
  /** Placement relative to existing panels */
  placement?: ItemFormSidebarPanelPlacement;
};
```

## Dependencies

### Core Dependencies (package.json:38-43)

- **`@datocms/cma-client`**: Types for DatoCMS entities (Item, Field, Upload, etc.)
- **`penpal`**: Iframe ↔ parent window communication
- **`datocms-structured-text-utils`**: Utilities for Structured Text fields
- **`@types/react`**: React types (SDK is framework-agnostic but provides React types)

### Why Penpal?

[Penpal](https://github.com/Aaronius/penpal) was chosen because it:
- Provides **promise-based RPC** for iframe communication
- Handles **security** (origin checking)
- Works in **all modern browsers**
- Has a **simple API** for bidirectional communication
- Properly handles **asynchronous methods**

Alternative approaches (like `postMessage` directly) would require manually:
- Building a request/response protocol
- Managing promise resolution/rejection
- Handling method serialization
- Implementing timeout logic

## Example: Complete Plugin Flow

Let's trace a complete example of a field extension plugin:

### 1. Plugin declares a field extension

```typescript
// my-plugin/src/index.ts
import { connect } from 'datocms-plugin-sdk';

connect({
  // Declaration hook: tell CMS about the field extension
  manualFieldExtensions(ctx) {
    return [
      {
        id: 'colorPicker',
        name: 'Color Picker',
        type: 'editor',
        fieldTypes: ['string'],
      },
    ];
  },

  // Render hook: render the field extension UI
  renderFieldExtension(fieldExtensionId, ctx) {
    if (fieldExtensionId === 'colorPicker') {
      ReactDOM.render(<ColorPicker ctx={ctx} />, document.getElementById('root'));
    }
  },
});
```

### 2. User installs plugin in DatoCMS

- User adds plugin with entry point URL: `https://my-plugin.com`
- Plugin becomes available in the project

### 3. User configures a field to use the extension

- User edits a "Color" field (type: string)
- Sets "Presentation" → "Editor" → "Color Picker" (our plugin)

### 4. CMS loads the field extension

When user opens a record with that field:

```typescript
// CMS invokes declaration hook to get field extension info
const extensions = await pluginConnection.callMethodMergingBootCtx(
  'manualFieldExtensions',
  [],
  { /* ctx properties */ },
  [],
  'call-1'
);

// CMS creates iframe for the field extension
// Sets iframe src to: https://my-plugin.com?mode=renderFieldExtension
```

### 5. Plugin connects and renders

```typescript
// Inside plugin iframe
connect({ /* hooks */ });

// SDK establishes Penpal connection
// CMS calls getSettings() → { mode: 'renderFieldExtension', field: {...}, ... }

// Bootstrapper activates for renderFieldExtension
// Hook is called with full context
// ColorPicker component renders
```

### 6. User interacts with the field

```typescript
function ColorPicker({ ctx }) {
  const currentValue = ctx.formValues[ctx.fieldPath];

  return (
    <Canvas ctx={ctx}>
      <input
        type="color"
        value={currentValue || '#000000'}
        onChange={(e) => {
          // Update the field value in the form
          ctx.setFieldValue(ctx.fieldPath, e.target.value);
        }}
      />
    </Canvas>
  );
}
```

### 7. Context updates trigger re-renders

When `setFieldValue()` is called:
1. CMS updates form state
2. CMS calls `onChange(newSettings)` with updated `formValues`
3. Bootstrapper's render function is invoked
4. `renderFieldExtension` hook is called again with new context
5. ColorPicker re-renders with new value

### 8. User saves the record

```typescript
// CMS might call event hooks
await pluginConnection.callMethodMergingBootCtx(
  'onBeforeItemUpsert',
  [item],
  { /* ctx */ },
  [],
  'call-2'
);

// Hook can validate or transform the item before save
```

## Summary

The DatoCMS Plugin SDK is a well-architected system that enables safe, type-safe extension of the DatoCMS Studio through:

1. **Iframe isolation** for security and stability
2. **Hook-based architecture** for clean separation of concerns
3. **Rich context objects** providing full access to project data and CMS capabilities
4. **Bidirectional RPC communication** via Penpal for seamless integration
5. **Automatic type generation** from TypeScript AST for documentation and tooling
6. **Flexible rendering** with self-resizing iframes and reactive updates

This architecture allows plugin developers to focus on building features rather than infrastructure, while maintaining type safety and excellent developer experience.
