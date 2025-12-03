# React UI Package - Development Guide

## Overview

The `datocms-react-ui` package provides React components that mimic the DatoCMS interface inside plugins. This package has several unique architectural choices that differ from typical React component libraries.

## Key Peculiarities

### 1. CSS Modules with JSON Import Pattern

**What's unique:**
Components import CSS modules as `.css.json` files instead of the typical `.css` pattern:

```typescript
import styles from './styles.module.css.json';
```

**Why:**
The CSS files are processed by PostCSS during the build step to generate JSON mapping files. This approach:
- Generates scoped class names with hash suffixes (e.g., `_button_474wk_1`)
- Provides type-safe style object access in TypeScript
- The JSON files are generated during the `generate-cssmodules` build step

**Example:**
```json
{
  "button": "_button_474wk_1",
  "disabled": "_disabled_474wk_30",
  "buttonType-muted": "_buttonType-muted_474wk_34"
}
```

### 2. Multi-Step PostCSS Build Pipeline

**Build order:**
1. `generate-cssmodules`: Runs PostCSS with `postcss-modules` plugin on source CSS files
   - Creates `.css.json` mapping files in a `tmp` directory
   - These JSON files are then imported by React components
2. `tsc`: Compiles TypeScript to CommonJS (dist/cjs)
3. `tsc --project ./tsconfig.esnext.json`: Compiles to ESM (dist/esm)
4. `generate-typedoc`: Generates API documentation as JSON
5. `generate-global-styles`: Bundles all CSS into a single minified `styles.css`

**PostCSS configuration** (packages/react-ui/postcss.config.js):
- `prebuild` mode: Only runs `postcss-modules` to generate JSON mappings
- `production` mode: Runs full pipeline (import, calc, nested, cssnano)

### 3. Dual Module Output (CJS + ESM)

**Package entry points:**
- `main`: `dist/cjs/index.js` (CommonJS)
- `module`: `dist/esm/index.js` (ES Modules)
- `typings`: `dist/types/index.d.ts`

**Two separate TypeScript builds:**
- Base `tsconfig.json`: Outputs CommonJS to `dist/cjs` with types to `dist/types`
- `tsconfig.esnext.json`: Outputs ESM to `dist/esm` with `module: "esnext"`

Both builds share the same source but produce different module formats.

### 4. Separation of CSS and JavaScript

**How it works:**
- Component JavaScript imports `.css.json` files to know which scoped class names to use (e.g., `_button_474wk_1`)
- The actual CSS is NOT bundled into the JavaScript
- Plugin developers must import the complete `styles.css` file separately
- This stylesheet contains all component styles with the prefixed class names

**The workflow:**
1. Build process generates scoped class names via PostCSS
2. JSON mapping files tell components which class names to apply
3. All CSS is bundled into a single `styles.css` file
4. Plugin developers import both the components (JS) and the stylesheet (CSS)

**Example usage in a plugin:**
```typescript
import 'datocms-react-ui/styles.css';  // Import styles once
import { Button } from 'datocms-react-ui';  // Import components

// Button component knows to use class "_button_474wk_1" from the JSON
// That class is defined in the styles.css you imported above
```

**Files published:**
- `src/` - Source files
- `dist/` - Compiled JS and types (with .css.json references)
- `styles.css` - Minified global stylesheet with all component styles
- `types.json` - TypeDoc JSON for documentation

### 5. Theme Variables via Context

**Pattern:**
Components receive a `ctx` (context) object from the DatoCMS plugin SDK that contains:
- `theme`: Color values and design tokens
- `bodyPadding`: Layout spacing
- Other plugin-specific configuration

The `Canvas` component:
1. Accepts the `ctx` prop from the SDK
2. Converts theme values to CSS custom properties via `generateStyleFromCtx()`
3. Injects these as inline styles on the wrapper div
4. Provides context via `CtxContext` to child components

**Example transformation:**
```typescript
// Input: ctx.theme.accentColor = "rgb(255, 94, 73)"
// Output CSS:
{
  '--accent-color': 'rgb(255, 94, 73)',
  '--accent-color-rgb-components': '255, 94, 73'
}
```

This allows components to use `var(--accent-color)` in their CSS and adapt to different DatoCMS themes.

### 6. Font Loading via @font-face

The package includes inline `@font-face` declarations for the Colfax Web font family (loaded from TypeKit CDN) in `base.css`. This is unusual for a component library - typically fonts are user-provided.

**Rationale:**
Ensures visual consistency with DatoCMS's brand typography regardless of where plugins are loaded.

### 7. Auto-Resizing Integration

The `Canvas` component includes plugin frame auto-resizing logic:
- Calls `ctx.startAutoResizer()` on mount
- Calls `ctx.stopAutoResizer()` on unmount
- Can be disabled via `noAutoResizer` prop

This automatically adjusts the iframe height based on content, which is specific to the DatoCMS plugin architecture.

### 8. TypeDoc JSON Generation

The package generates a `types.json` file via TypeDoc containing the full API documentation in structured JSON format. This is published alongside the npm package, which is uncommon.

**Use case:**
Likely used by DatoCMS documentation site or tooling to automatically generate up-to-date API docs.

### 9. Component Documentation via JSDoc Examples

Components include extensive JSDoc comments with interactive examples using the `@example` tag. These examples reference the `Canvas` and `Section` components to demonstrate usage in a DatoCMS plugin context.

**Pattern:**
```typescript
/**
 * @example Button types
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Button buttonType="primary">Submit</Button>
 * </Canvas>
 * ```
 */
```

This documentation is extracted into the `types.json` file for external tooling.

### 10. Development Workflow with `install-in-place`

The package includes a custom `install-in-place` script:
```bash
npm run build && rm -rf $INSTALL_PATH/node_modules/datocms-react-ui/dist && cp -rf dist styles.css types.json $INSTALL_PATH/node_modules/datocms-react-ui
```

**Purpose:**
Allows rapid iteration when developing the UI library alongside a plugin project by replacing the installed package's dist files without re-publishing to npm.

## Development Workflow

### Building

```bash
npm run build
```

This runs the full pipeline:
1. Clean `dist/`
2. Generate CSS module JSON files
3. Compile TypeScript (both CJS and ESM)
4. Generate TypeDoc JSON
5. Generate global CSS bundle

### Adding a New Component

1. Create component directory: `src/NewComponent/`
2. Add TypeScript component: `src/NewComponent/index.tsx`
3. Add CSS module: `src/NewComponent/styles.module.css`
4. Import styles as: `import styles from './styles.module.css.json'`
5. Export from `src/index.ts`
6. Update `src/global.css` to include the new CSS module
7. Run `npm run build` to generate JSON and types

### CSS Module Notes

- Use nested selectors (PostCSS nested plugin is enabled)
- Reference CSS variables with `var(--variable-name)`
- Class names in JSON will have hash suffixes
- The JSON file is generated, never edit it manually

### Testing Changes Locally

Use the `install-in-place` script with `INSTALL_PATH` environment variable:

```bash
INSTALL_PATH=/path/to/plugin-project npm run install-in-place
```

## Dependencies

### Runtime Dependencies
- `datocms-plugin-sdk` - The core SDK for type definitions and utilities
- `classnames` - For conditional CSS class composition
- `react-intersection-observer` - For visibility detection
- `react-select` - For select input components
- `scroll-into-view-if-needed` - For scroll utilities

### Build Dependencies
- PostCSS toolchain (`postcss-cli`, `postcss-modules`, `postcss-nested`, etc.)
- TypeDoc for documentation generation
- TypeScript for compilation

## Package Structure

```
packages/react-ui/
├── src/                          # Source files
│   ├── base.css                  # Font definitions
│   ├── global.css                # Import aggregator for global bundle
│   ├── index.ts                  # Main export file
│   ├── icons.tsx                 # Shared icon components
│   ├── Button/
│   │   ├── index.tsx             # Component implementation
│   │   └── styles.module.css     # Scoped styles
│   └── [other components]/
├── dist/                         # Build output
│   ├── cjs/                      # CommonJS build
│   ├── esm/                      # ES Modules build
│   └── types/                    # TypeScript definitions
├── styles.css                    # Global CSS bundle (generated)
├── types.json                    # TypeDoc JSON (generated)
├── tsconfig.json                 # Base TS config (CJS)
├── tsconfig.esnext.json          # ESM TS config
└── postcss.config.js             # PostCSS configuration
```

## Common Issues

### CSS Module JSON Not Found

**Error:** Cannot find module './styles.module.css.json'

**Solution:** Run `npm run generate-cssmodules` or full `npm run build`. The JSON files are generated, not committed to git.

### TypeScript Errors in CSS Imports

**Solution:** The build generates `.d.ts` files for CSS modules automatically. Ensure `dist/` contains the generated types.

### Styles Not Applying

**Check:**
1. Is the component wrapped in `<Canvas ctx={ctx}>`?
2. Are CSS custom properties being set correctly?
3. Is the global `styles.css` imported if needed?

### Build Order Issues

Always run the full `npm run build` rather than individual steps, as they have dependencies:
1. CSS modules must be generated before TypeScript compilation
2. TypeScript must compile before TypeDoc can extract types
3. Global CSS generation depends on all CSS modules existing
