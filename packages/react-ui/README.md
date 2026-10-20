# datocms-react-ui

The React components of the DatoCMS interface, for the plugins of DatoCMS. Version 3 is built from the components of the CMS itself.

## Install

```sh
npm install datocms-react-ui datocms-plugin-sdk react react-dom
```

React 18 or 19, and `datocms-plugin-sdk` 2.2.7 or later, are peer dependencies.

Import the CSS once, and each component from its own path:

```tsx
import 'datocms-react-ui/styles.css';
import Canvas from 'datocms-react-ui/Canvas';
import Button from 'datocms-react-ui/Button';
```

There is no root import (`from 'datocms-react-ui'`): a plugin bundles only the components that it imports.

## Canvas

Put a `Canvas` around the content of each hook that renders in a frame, with the `ctx` of the hook:

```tsx
connect({
  renderPage(pageId, ctx) {
    render(
      <Canvas ctx={ctx}>
        <MyPage />
      </Canvas>,
    );
  },
});
```

The components of react-ui read the host through `Canvas`. Without it, they stop with an error.

| From the host | What `Canvas` does |
| --- | --- |
| `ctx.cssDesignTokens` | Writes the color tokens on its element, and again around the content of each menu, tooltip and dialog (they render at the end of the body). The host keeps the colors up to date, also for an old plugin. |
| `ctx.colorScheme` | Sets `data-color-scheme` on its element. |
| `ctx.bodyPadding` | Is the padding of its element. |
| `ctx.ui.locale` | Is the language of the texts of the components (plurals, numbers). The texts are in English. |
| `ctx.ui.dateFormat`, `timezone`, `twentyFourHour` | Are the date settings of `SmartDate`, the time cells of `Table` and `useDateSettings`. A host that is older than these fields gives only `locale`: then the date format is the first one of the CMS for that language (`MM/dd/yyyy` for English, `dd/MM/yyyy` for most of the others), the time zone is the one of the browser, and the clock has 24 hours for English only, as in the CMS. |
| `ctx.notice`, `ctx.alert`, `ctx.customToast` | Show the notifications of the components (a copied value, an error). A warning is a `customToast` of type `warning`. |
| `ctx.openConfirm` | Asks the questions of the components (close a dialog with changes). The host panel has no text input and no switch: a question with `explicitConfirmation` or `acknowledgement` shows without them. |
| `ctx.navigateTo`, `ctx.location` | Are the router of the links (`Link`, `Tabs`, a `Table` row with `to`). A `to` is a path of the CMS, with the environment. A click calls `ctx.navigateTo`; the `href` is the full URL of the page on the internal domain of the project, thus a middle click opens it in a new tab. In a page and in an inspector, `ctx.location` makes the link of the open page active. `ctx.navigateTo` always adds an entry to the history. |
| The frame | Starts the auto-resizer of the frame. |

The props of `Canvas`:

- `ctx`: the `ctx` of the hook.
- `noAutoResizer`: does not start the auto-resizer, for a plugin that sets the height of its frame itself.
- `texts`: more texts, by key, in the ICU syntax. A key of the components (also a key of `ContextInspector`, such as `contextInspector.runExample`) gets a new text (also an aria text, for example `{ 'spinner.label': 'Caricamento' }`); a key of the plugin gives the text of a `{ id: 'my.key', values }` message. Give a constant.
- `navigation`: the router of a plugin with a router of its own (a `NavigationAdapter`: `navigate`, and the optional `location` and `href`). Give a stable object.

`useCtx()` gives the `ctx` of the nearest `Canvas`, with the type that you give: `useCtx<RenderPageCtx>()`.

## ContextInspector

`ContextInspector` shows the `ctx` of the nearest `Canvas`, for the development of a plugin. Each group of the SDK (the plugin, the project, the toast methods...) is a panel that opens and closes. For each property and method, it shows the name and the type, with a link to its source in the SDK repository, and the description. A property also shows its current value, a method with an example shows the example: each box has a copy button, and "Run example" runs the example with the `ctx` of the plugin. When an example fails, the error goes to the console and `ctx.alert` tells it.

```tsx
import ContextInspector from 'datocms-react-ui/ContextInspector';

<Canvas ctx={ctx}>
  <ContextInspector />
</Canvas>
```

- `titleLevel`: the level of its two headings ("Hook-specific", "Available on every hook"), after the headings around it. The title of each group is one level below. The default is 2.

The groups come from the `manifest` of `datocms-plugin-sdk`: the inspector imports it at run time, from the version of the SDK that the plugin installs. A hook that this version does not know shows nothing. Only this entry imports the manifest, thus a plugin that does not import `ContextInspector` does not bundle it.

## Texts of the props

A prop with a text takes a `Message`: a string, `{ id, values }` (a key of the `texts` of `Canvas`), `{ html }` (markup, sanitized), or an element. A prop that goes in an attribute (`ariaLabel`, a tooltip) takes a `TextMessage`: a string or `{ id, values }`. The host draws the notifications and the dialogs with plain text only: the markup of a message goes away there.

## Fields

`FieldWrapper` draws a field of the CMS around one input: the label, the input, the error and the hint. The field owns the accessibility (the ids, the name, the description), and the input owns the value. The inputs are controlled, and they do not need a form library.

```tsx
import FieldWrapper from 'datocms-react-ui/FieldWrapper';
import StringInput from 'datocms-react-ui/StringInput';

<FieldWrapper
  label="Title"
  hint="The title of the page"
  error={title ? undefined : 'Enter a title'}
  required
>
  <StringInput value={title} onChange={setTitle} />
</FieldWrapper>
```

- `label`, `hint` and `error` take a `Message`. `error` is the error of the value: the field shows it under the input, and the input gets `aria-invalid`. Without it, the value is valid.
- The field gives the input its `id`, `aria-labelledby`, `aria-describedby` (the error and the hint), `aria-invalid` and `aria-required`. A prop that you give to the input wins.
- The input takes its own props: `value`, `onChange` (the new value, not an event), `onBlur`, `disabled`, `placeholder`, `options`... `name` and `onBlur` are optional. The `onBlur` of a react-final-form `input` takes no value: give `onBlur={() => input.onBlur()}`.
- The value of a text input is a `string` or `null`: an empty input gives `null`. Keep it in `useState<string | null>`.
- The value of `SelectInput` is the `value` of the option (a string, or a list of strings with `multiple`), not the option object.

A `SwitchInput` names itself with its `label`. A field around a switch takes no `label`, only the `hint` and the `error`. In a form, a switch goes in a `FieldWrapper` like every other input, also without a hint: the field gives the space between the fields.

```tsx
<FieldWrapper hint="The editors see the draft in the preview pane.">
  <SwitchInput label="Show the preview" value={preview} onChange={setPreview} />
</FieldWrapper>
```

An input of your own calls `useFieldInput` (from `datocms-react-ui/FieldWrapper`) with its props, and puts the result on the element that gets the focus: thus it works in a `FieldWrapper`. A composite input (`TableList`, `KeyValueList`, `InputGroup.Root`) takes the field for its group element and renders its inner inputs in a `FieldWrapper.Boundary`, thus each inner input keeps its own name. Do the same in a composite input of your own.

### From react-ui 2.x

| 2.x | 4 |
| --- | --- |
| `TextField` | `FieldWrapper` + `StringInput` |
| `TextareaField` | `FieldWrapper` + `TextareaInput` |
| `SwitchField` | `FieldWrapper` with only the `hint` and the `error` + `SwitchInput` with the `label` |
| `SelectField` | `FieldWrapper` + `SelectInput` |
| `AsyncSelectField` | `FieldWrapper` + `SelectInput` + `useAsyncSelectOptions` (from `datocms-react-ui/hooks/useAsyncSelectOptions`) |
| `CreatableSelectField` | `FieldWrapper` + `SelectInput` with `creatable` |
| `AsyncCreatableSelectField` | `FieldWrapper` + `SelectInput` with `creatable` + `useAsyncSelectOptions` |
| `FieldWrapper` | `FieldWrapper` |
| `PasswordInputField`, `TextInput` with `type="password"` | `PasswordInput` |

The props of the input that 2.x took in `textInputProps`, `switchInputProps` or `selectInputProps` go to the input itself.

The value of `SelectInput` is the string id of the option (a list of ids with `multiple`), not the option object of 2.x. `onChange` gives the chosen option (or the list of options) as its second argument. `useAsyncSelectOptions` replaces `loadOptions`: it loads the options of the query, and `SelectInput` shows them without a filter of its own.

