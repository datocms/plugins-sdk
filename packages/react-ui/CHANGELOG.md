# datocms-react-ui

## 3.1.0-next.10

### Minor Changes

- New `ColorInput` entry (`datocms-react-ui/ColorInput`): the input of a color, as in the color fields of DatoCMS. The user types a hex value, or picks the color in a picker with a color area, a hue slider and, in the browsers that have one, an eye dropper. The value is `{ red, green, blue, alpha }` (each channel from 0 to 255) or `null`, the shape of the value of a color field. `alpha` adds an alpha slider, `presetColors` adds colors for one-click picks, `clearable={false}` removes the clear button, and `autosize` gives the input a fixed width instead of the width of its container. It follows the contract of the other inputs (`value`, `onChange`, `onBlur`, `name`, `disabled`, `readOnly`), works in a `FieldWrapper`, and takes `ariaLabel` out of one.
- Three new color tokens for a control that is on: `--color--control-on--surface`, `--color--control-on--surface-hover` and `--color--control-on--ink`. A checked checkbox, a selected radio and a switch that is on use them. The project theme gives them a value with 3:1 on the page in both color schemes, thus a control that is on is visible also when the brand color is light. A plugin can read them as the other color tokens.
- `FieldWrapper` has a new `status` prop: a note about a value that is valid, but that the user must know about (for example, a color that is hard to read). It shows in the place of the hint, with a warning icon and color, and the link of `docs` stays under it. The input gets it as its description, without `aria-invalid`, and an error hides it. `status.action` adds a fix as a `Pill` at the end of the line, with an optional `lead` text and a color `swatch`.
- The stylesheet has no `--wash-*` custom properties. The project theme gives a value to the grey color tokens (`--color--surface`, `--color--ink`, `--color--border` and the others), as it does for the tokens of the brand color. A plugin reads them as before. A plugin that reads a `--wash-*` property takes the semantic token in its place.
- New `RangeInput` entry (`datocms-react-ui/RangeInput`): a slider for a number between `min` and `max` (0 and 100 by default), in steps of `step` (1 by default). `onChange` gets the new value on each move, so a plugin can show the result while the user drags. It follows the contract of the other inputs (`value`, `onChange`, `onBlur`, `name`, `disabled`), works in a `FieldWrapper`, and takes `ariaLabel` out of one.

### Patch Changes

- The default values of `--color--navbar-bright--surface`, `--color--navbar-bright--surface-hover` and `--color--navbar--surface-hover` are a little lighter. The contrast between the two surfaces of the navigation bar follows the lightness of the bar.
- In Chromium, a row of tabs that scrolled while it was narrow kept a faded edge after it grew. The row now clears the fade when it stops scrolling.
- Updated dependencies
  - datocms-plugin-sdk@3.0.0-next.5

## 3.1.0-next.9

### Patch Changes

- The version goes back to 3. `4.0.0-next.7` and `4.0.0-next.8` are prereleases of 3.1.0 with a wrong number: their changes are in this version. Install `datocms-react-ui@next`, or `3.1.0-next.9` and later.

## 4.0.0-next.8

### Minor Changes

- New entries show a field type as DatoCMS shows it. Give them the `field_type` of a field, as the CMA gives it.
  
  - `FieldTypeAvatar` (`datocms-react-ui/FieldTypeAvatar`): the icon of the group of the field type, on the colors of the group.
  - `FieldTypeName` (`datocms-react-ui/FieldTypeName`): the name of the field type, as text in the language of the user.
  - `useFieldTypeName` (a named export of `datocms-react-ui/FieldTypeName`): a function that gives the same name as a string, for example for the text of a tooltip.
  
  `datocms-react-ui/utils/fieldTypes` has the data behind them:
  
  - `fieldTypeGroups`: the groups and their field types, in the order of the "Add new field" menu.
  - `fieldGroupOf`: the group of a field type.
  - `fieldTypeMessage` and `fieldGroupMessage`: the name of a field type and of a group, for a prop that takes a text.
  - `fieldTypeSurface`: the colors of the group of a field type, for an `IconAvatar` with your own icon.
  - The `FieldType` and `FieldGroupName` types.
  
  A field type that the package does not know gets a generic icon on the neutral surface, and its `field_type` string as its name.
  
  The names of the field types and of the groups are new keys of the `texts` of `Canvas`: `fieldType.*` and `fieldGroup.*.title`.

### Patch Changes

- The hues of `InitialsAvatar` have the same contrast between the letters and the square: 5:1 in light mode and 8:1 in dark mode. Some hues were below 4.5:1 in light mode.
- A small `IconAvatar` draws a larger icon. The icon fills 55% of the square, but at least 14px, with a 3px margin on each side. At 20px, in a menu or in a line of text, the icon is 14px and no longer 11px.
- The `mode` of a `Pane` stops on a click out of the pane, not when the pointer goes down. When the content of a `SplitPane` stops asking for a larger width with `useSecondaryPaneMinSize`, the pane keeps that width until `size` changes. Thus the elements do not move under the pointer between the press and the release, and the click goes to the element that the user wanted.

## 4.0.0-next.7

### Major Changes

- `detail.placement` of `ListDetail.Split` and `ListDetail.Page` is required and has no default. Pass `placement: 'beside'` to keep the panel on the right of the list, or `placement: 'over'` when the table needs all the width.

### Minor Changes

- `UploadPreview` and `UploadCard` show an asset of the Media Area as DatoCMS shows it. Give `upload`: the asset as `ctx` gives it (for example a result of `ctx.selectUpload()` or `ctx.loadUploads()`), its ID, or `null` for an asset that does not exist. An ID loads through `Canvas` with `ctx.loadUploads`, in one call for the IDs of one render; with an older DatoCMS host, or a host that does not answer with one entry for each ID, the asset shows as an asset that does not exist, with a warning in development. The preview draws the image of the image service at the size of the box with a blurred picture while it loads, the frame of a video (the `poster_time` of `fieldValue`, the value of the field, changes it), the waveform of a sound file with a play button (one sound plays at a time on the page), and the icon of the format for any other file. Without `box`, the preview measures its element. `UploadCard` with `upload` gets its preview, the antivirus badge, a play action for a sound file, and its caption from `uploadCardCaption(upload, { preferredLocale, mainLocale, fieldValue })`, as the gallery field of DatoCMS shows it: the title and the alternate text of the value of the field, then the default metadata of the asset in `preferredLocale`, then in the main locale of the project, which `Canvas` gives from `ctx.site`. `caption` overrides it, and `null` hides it. The parts of the box (`UploadPreview.Image`, `UploadPreview.Progress`) and the children of `UploadCard` stay for the mode where you draw the asset, for example a file that uploads. `UploadPreview` reads `default_field_metadata` in the two shapes of the SDKs.
  
  `formatBytes` (`datocms-react-ui/utils/format`) writes a size in bytes as the Media Area writes it.
- New component `UserRow`: a person (a collaborator, an account, an organization, an SSO user, an API token, an invitation) as an `EntityRow` with an `Avatar`. Give `user` (the person as the API and `ctx` give it, for example `ctx.currentUser` or a result of `ctx.loadUsers()`): the row finds the name and the email with the rules of DatoCMS, and `showKind` shows the kind of the person after the name, for example "SSO user". Give `presentation` (`name`, `email`, `imageUrl`) when you already have the data, with `kind` for the note after the name. The avatar is the Gravatar image of the email, and the initials when there is no Gravatar image, unless `imageUrl` is given. `layout="row"` shows the avatar of 32px, the name and the email below it, for a list or a menu; its children replace the email. `layout="inline"` shows the avatar of 20px and the name on one line, for a chip, the value of a select, a cell of a table or a text. `userPresentation(user)` and `userKindLabel(type)` give the name, the email and the kind of a person for a custom UI.
- Add `DateInput` and `DateTimeInput` (`datocms-react-ui/DateInput`, `datocms-react-ui/DateTimeInput`): the inputs of the date fields and of the date and time fields, with a calendar and a time zone menu. They follow the contract of the other controlled inputs (`value`, `onChange`, `onBlur`). `DateInput` gives a `yyyy-MM-dd` string, and `DateTimeInput` gives an ISO 8601 string with the offset of the time zone of the project, as the API does. Inside `Canvas` they need no setup: they take the date format, the clock, the language and the time zone of the user from `ctx.ui`, and the time zone of the project from `ctx.site`. The calendar works with the keyboard (arrows, Home, End, Page Up and Page Down). `selectableDays` (`'all'`, `'future'` or `'past'`) limits the days of the calendar. As the other inputs, they fill the width of their container, and `autosize` makes them as wide as their content. Import the CSS of `datocms-react-ui/styles.css`, as for the other components.
  
  Add `DateTimeRangeInput` (`datocms-react-ui/DateTimeRangeInput`): the input of a range of dates and times, for example the time range of a log. The trigger opens a menu with your presets and "Custom range", which opens a calendar and a date and a time for each end. The value is `{ preset }` or `{ start, end }`, with each end as an ISO 8601 string with the offset of the time zone of the project, as the value of `DateTimeInput`, or `null`. `presets` takes the `options` of the menu and the `default` preset that the clear button sets. It takes the same date settings, `selectableDays` and `autosize` as `DateTimeInput`, and the calendar works with the same keys. `variant="filter"` fits the custom editor of a `FilterBuilder` operator.
- Add `FilterBuilder` (`datocms-react-ui/FilterBuilder`): a controlled list of filter conditions, each one a field, an operator and a value, that the user adds, changes and removes. Give it the `fields` that the user can filter by, each with its operators, and an editor for the value of each operator: none, text, number, list, select, a group of arguments, or a custom editor that renders an input of your own. A change of operator keeps the value when it fits the new editor. A field can show a `code` (its key in your API) in the menus, and a select or a custom editor gives the `defaultValue` of a new condition. An operator with `deprecated` shows only in the conditions that already use it. `readOnly` shows the conditions with no buttons, and the user cannot change them. `oneConditionPerField` limits a field to one condition. In a `Toolbar.Search` of a `<Toolbar fields>`, it shows a funnel before its tiles, and the toolbar lines up the parts of the row at the height of a field.
- New component `RecordRow`: a record as DatoCMS shows it in its lists and in its link fields, with the image, the model, the title, the validity triangles and the status. Give `item` (an ID or a record) and the row loads the title and the image from the host with `ctx.loadItemPresentationInfo`, also when another plugin changes them with `buildItemPresentationInfo`: the rows of one render load in one call. While the record loads, the title is a placeholder that a screen reader reads as busy; a record that does not exist shows "Record #" and the ID. The row is a snapshot and does not follow later changes of the record. Give `presentation` when you already have the data: a result of `ctx.loadItemPresentationInfo` is a `RecordRowPresentation`, and the row finds its model from `itemTypeId`. `model` replaces the model of the host. `showId` shows the ID of the record, and `standalone` makes the row ignore the `RecordRow.List` around it. `layout="row"` shows the model above the title and the children below it; `layout="inline"` is one line for a chip or a cell. `RecordRow.List` around the rows aligns their titles, and hides the model with `showModel={false}`. `RecordRow.Image` is the image of a record alone. With a host that is older than `ctx.loadItemPresentationInfo`, or that does not answer with one entry for each record, a row with `item` shows "Record #" and the ID, and the model and the status of a full record, with a warning in development.

### Patch Changes

- Updated dependencies
  - datocms-plugin-sdk@3.0.0-next.4

## 3.1.0-next.6

### Minor Changes

- `onClear` of `useFilterToolbar` can return a function that puts the filter back. The close of a filtered list still clears the filter, and the next open of the filter runs that function, thus the same filter applies again. A filter that the list gets while the filter is closed wins: the open does not replace it. The hook keeps the function only while the list is mounted.
- The icons that the components draw (the chevrons, the carets, the crosses, the grips, the icons of the toolbars and of the messages) are the outline icons of Lucide. A component draws them with a stroke that takes the color of its text. The package has the ISC notice of Lucide in `dist/LICENSE-lucide.txt`. A plugin that gives its own icons to the components sees no change.

### Patch Changes

- The peer range of `datocms-plugin-sdk` accepts the SDK 3 (`^2.2.7 || ^3.0.0-next.0`), thus a plugin can update the SDK and keep react-ui.
- Updated dependencies
  - datocms-plugin-sdk@3.0.0-next.3

## 3.1.0-next.5

### Patch Changes

- `BlankSlate`: a button with a long label in `actions` gets an ellipsis and stays inside the slate.
- `Button`, `SplitButton` and `ButtonTrigger` are never wider than their container. A long label ends with an ellipsis, and the icon, the chevron of the trigger and the caret of the split button stay visible. The full label stays the accessible name.
- `Button`: a soft button with `pressed` gets the look of a selected row (the selected surface with a brand border), thus a soft toggle that is on is visible, also on hover and on focus. A ghost button that is on, or a ghost trigger with its menu open, keeps its hover surface with the link ink, thus the state shows also in the dark scheme. The other tones are not toggles and do not show `pressed`.
- CardList: the title, the aside and the trailing part of the header share its width in equal parts, and the trailing part of a row never takes more than the summary. A long API key or a long pill ends with an ellipsis, and the title and the summary stay visible. The `trailing` of a row is now in a `CardList__trailing` element.
- `Dropdown`: opening a menu (by click or by keyboard) keeps the scroll position of the page, also when the document has scrolled. The menu, its search field and the search field of a submenu get the focus only once they are next to their trigger.
- A `Dropdown` is never wider than its container. A long label of a `ButtonTrigger` or a long value of a `TextualTrigger` gets an ellipsis, and the chevron always shows.
- EmptySlot: actions that do not fit on one line wrap, and the slot gets taller, instead of going out of both sides of the slot.
- EntityRow: the title, the `afterTitle` content and the aside share the width of the title line in equal parts. A short title stays whole next to long pills or a long API key, and a long part ends with an ellipsis instead of pushing the title to 0px.
- The CSS of react-ui does not set `height: 100%` on `html` and `body`: the document of a frame takes the height of its content, thus the auto-resizer of `Canvas` makes the frame shorter when the content gets shorter. A plugin with a full-height layout (a page) sets that height itself.
- An icon takes the color of its text through `currentColor`, and keeps its own `fill` attribute: an outline icon (`fill="none"`, as in Lucide or Heroicons) stays an outline in the page, in `BlankSlate`, in `Pill` and in `SegmentedControl`.
- Every component sets the `color` of its icons, not their `fill`. Any icon set works in every component and in every state: an outline icon (Lucide, Tabler, Heroicons outline) stays an outline and takes the color of the component, and a filled icon (Font Awesome, Heroicons solid, react-icons, Phosphor, Material) takes it too.
- InfoList: a long row title stops at 70% of the row and wraps, thus the value always keeps the rest of the row.
- `ApiKey`: a key longer than its place ends with an ellipsis, as `CopyableId`, and stays on the baseline of the text around it. `RadioGroupInput`: the text of an option can shrink, thus a long word in a label or in a hint wraps inside the option.
- A long word (a URL, an id) breaks inside its line when it does not fit, for example in a `Callout`, in the hint of a field and in the options of `RadioGroupInput`. The layouts keep their widths.
- Page.Group: when the title and the `actions` or the `status` do not fit on one line, the actions and the status go under the title, thus they never cover it. A long word in the title breaks inside its box.
- `Toolbar.PresetsTitle` and the presets of `Pane.Header.Title`: a long title ends with an ellipsis in the toolbar, and the chevron of the menu stays visible.
- A plain `<input type="search">` has the same border-box sizing as the other text inputs, thus it fits its container and no longer runs 22px past it.
- `SegmentedControl` stays in its container: when the labels do not fit (for example in a translation), the options shrink and their labels end in an ellipsis. The accessible name keeps the full label.
- `SelectInput` and `FieldWrapper`: in a flex row or in a grid, a select (also an `autosize` one) and a field are never wider than their place. A long value or chip ends with an ellipsis, and the clear button and the chevron stay visible.
- SettingsList: the narrow layout follows the width of the list, not of the viewport. In a list narrower than 480px, the value is at the left and keeps the width of the row, and the action goes under it when the two do not fit, thus a long action label does not crush the value. A long value goes on more lines, and a label longer than the row gets an ellipsis.
- `SwitchList`: in a row, a hint or an error stays in the column of the label, and the column of the switch stays empty under the switch. The reason of `forcedOn` stays at the end of the line of the label when the two fit, and goes under the label when they do not, whatever the width of the window: a long reason no longer squeezes the label or covers it.
- Tabs, Toolbar.Tab and Toolbar.TabLink: when the tabs do not fit, the row scrolls until the active tab is fully visible: on a click, with the arrow keys, Home and End, and when the tabs mount. Only the row scrolls, not the page.
- Tabs: when the tabs do not fit, an edge of the row fades where tabs are hidden past it. The fade is a mask, thus it works on any background.
- `Toolbar.Pagination` fits a narrow toolbar: when the toolbar is narrow, it shows fewer page buttons and hides the "items per page" select, and a centered toolbar never overflows past its start edge.
- `Toolbar.TextualDropdown`: a long value gets an ellipsis and shrinks with the title, thus the title stays visible in a narrow toolbar.

## 3.1.0-next.4

### Minor Changes

- `Page.Group` gets `count`: a number after the title, as the count of a `SidebarPanel`. The whole header of a group with `collapse` opens and closes the group, not only its title.

## 3.1.0-next.3

### Minor Changes

- `Pane.Header.Display` and the `display` prop of `ListDetail.Page`: a menu after the title that changes how the list shows (the layout, the order).

### Patch Changes

- Updated dependencies
  - datocms-plugin-sdk@2.6.0-next.2

## 3.1.0-next.2

### Minor Changes

- Code shows in Geist Mono, the monospaced font of the CMS. The browser downloads the font from `www.datocms.com`, as it does for ABC Oracle: if your plugin has a Content Security Policy, the `font-src` that allows ABC Oracle allows Geist Mono too.
- Rename the props of `MediaCard` and `UploadCard`, and change the caption and `UploadThreatTriangle`. react-ui 3 is in alpha, thus these props change without a major version:
  
  - `isDraggable`, `isDragging`, `isCompact` and `isDisabled` are now `draggable`, `dragging`, `compact` and `disabled`.
  - `caption` takes `{ text, muted }` in place of a text and `captionDisabled`: `caption={{ text: 'cover.jpg', muted: true }}`. `uploadCaption` gives this object, thus write `caption={uploadCaption(metadata)}`. The type of the object is `MediaCardCaption`.
  - `UploadThreatTriangle` has no `status` prop: render it only when the antivirus status of the upload is `infected`.
- New components for records and assets, with the look of DatoCMS:
  
  - `ItemStatus`: the colored dot of the publishing status of a record, with its label in a tooltip or as text.
  - `EnvironmentPill`: the pill of the type of an environment, primary or sandbox.
  - `UploadPreview`: the box with the preview of an asset, with `UploadPreview.Image` and `UploadPreview.Progress`. `UploadPreview.Image` takes `icon` for an image in the place of an icon: it always gets space around it.
  - `UploadCard`: the card of an asset, a `MediaCard` with the caption from the metadata (`caption={uploadCaption(…)}`), the progress of the upload and the antivirus badge.
  - `FileTypeIcon`: the icon of a file that has no preview, with its extension.
  - `TreeRow`: a row of a `SortableTree` with the chevron or the grip. It takes `drag` (the same `RowDrag` as a `Table.Row`: `wrapperRef`, `dropIndicator` and `handle`, also a disabled handle with its reason) and `indentation`. Give `handle` to the `SortableTree`: then a row with a disabled handle, or with no handle, does not move. `TreeRow.Link` is its content as a link, and `TreeRow.Action` is its content as a button, for example "Load more": the arrow keys of the tree move the focus to it.
  - `Table/cells/EntityCell`: the title of the entity of a row, with its image, in the first column of a `Table`.
  - `InfoList.Value` and `InfoList.User`, with their `.Trigger` parts: a value (`label`) and a user (the fields of an `Avatar`, with a `tooltip`) in a row of an `InfoList`, and the triggers of the menus that change them.
- `RowList` gets `density="compact"`, for a list in a container that already has an inset, such as a `SidebarPanel`: the image and the text of each row stay on the edge of the content of the panel. `RowList.Actions` holds the icon buttons at the end of a row that only shows its content: they show when the pointer or the focus is on the row, and at rest they take no space. `RowList` and `RowList.Item` also take a `className`, only for their place in the page.
- `SortableTree` takes `handle`: the user drags a row only from the element of `provided.dragHandleRef`, and a row without this element does not move, for example a row with a disabled handle or a "Load more" row. Without `handle`, the user drags a row from any point of it, as before.

### Patch Changes

- The types of `Dropdown.MenuSearch` compile with the React 18 types. They contained event handler types that only the React 19 types have (`SubmitEventHandler`, `ToggleEventHandler`), thus `tsc` failed on `datocms-react-ui/Dropdown` in a plugin with `skipLibCheck: false`.
- `Dropdown`, `SplitButton`, `InsertGap`, `Tooltip`, `HoverCard`, `Modal`, `FullscreenModal` and `SplitPane` do not have the `Static` and `Rail` members any more. They were pictures of the components for the pages of the DatoCMS website, and a plugin cannot use them. The components look and work as before.

## 3.1.0-next.1

### Minor Changes

- Add `Toolbar.Divider`, a hairline between two cells of a filter row. A `Toolbar.FilterInput` in a `Toolbar.Search` renders no search landmark of its own, thus the row has one search landmark. The Toolbar page has the rules of the filter row: one container, bare parts, a divider between two cells.
- Add the `xlarge` size to `Avatar`
  
  An `xlarge` avatar is 48px and has no ring. Use it for one person alone, for
  example in the header of a profile.
- Add `datocms-react-ui/Actions`, a registry of keyboard actions. `useRegisterActions` registers actions with a name, keys and a `run` function, for the app, the page, or a region that has the pointer or the focus. `Button` takes `tooltip={{ action }}` and `Dropdown.Option` takes `action`: they show the name and the keys of the action, and the option runs it. `Shortcut` draws the keys, and the `shortcut` of `Tooltip` takes the same keys. `Canvas` mounts the provider. A letter, a digit or a sign matches the character that the keyboard layout of the user types, thus Cmd + "-" on an Italian keyboard stays the zoom out of the browser.
- Show only the icons of a `SegmentedControl` with `iconOnly`
  
  With `iconOnly`, each option shows only its icon in a square button. The
  `label` of the option becomes its tooltip and its accessible name, thus each
  option must have an `icon` and a text `label`. Use it when the space is small
  and the icons are clear without a text.
- `Table.Row` takes `actions`: the keys of the actions work while the pointer or the focus is in the row, and a menu in the row runs the action of its row. A row without `actions` registers nothing: `useRegisterActions` skips an empty list.
- Add `IconAvatar`, an icon on a soft rounded square with the shape of an avatar, for a thing that has an icon and no image. `surface` picks the soft brand surface, the neutral one, or a surface and an ink from the data.
- Let `CardList.Item` be the trigger of a `Tooltip`
  
  `CardList.Item` gives its other props and its ref to its `li`. Put it in a
  `Tooltip` for a tooltip on the whole row:
  
  ```tsx
  <Tooltip label="Project with the most usage: Blog">
    <CardList.Item row={{ summary: 'Records', trailing: '820 / 1,000' }} />
  </Tooltip>
  ```
- Remove `datocms-react-ui/HotKey`: write a keyboard shortcut as an action of `datocms-react-ui/Actions`. `Button`, the button trigger of `Dropdown` and `Toolbar.PrimaryButton` take `tooltip={{ action }}` (or `action`, as `Toolbar.AddNewButton`) in place of `tooltip={{ hotKey: true }}`, and `Shortcut` draws the keys in place of `HotKey`. `Modal`, `FullscreenModal`, `Popover` and the menu of `Dropdown` are layers of the registry: while a menu is open, the keys of the page do not run, a dialog with its own `Main` keeps the actions of the app on as a menu does, and in a text field the first Escape leaves the field and the second one closes the dialog. An action takes a `group`, and a shortcut can use the keys F1 to F12. An `ActionLayer` takes its own `actions` and `active`: a layer that is not active does not stop the page and does not run its actions. `useRegisteredActions` lists the actions of the page and of the app. An action takes `keywords` and `palette` (`'listed'`, `'searchOnly'` or `'hidden'`) for a command palette, and `useReadPaletteActions` gives the actions of the palette as `PaletteAction`. `Toolbar.FilterToggle` takes `onOpen`: `F` and `/` open the filter and move the focus to it while the pointer or the focus is in the `Pane`, and the tooltip shows the keys. `useRegisterActions` takes an `undefined` region ref: the actions then work for the page. `LIST_ACTION_GROUP` is the group of the actions of a list. A `MediaCard` option takes `action`, as `Dropdown.Option`. The menu of a `Dropdown` in a region runs the action of that region, also when the pointer is on another row: each row of a list can register the same ids. The function of `useRunAction` takes `{ source, origin }` as its second argument. A key that the page dispatches on an iframe with `data-actions-frame` runs only the actions of the app and Escape. An action of `MultipleSelectionActionBar` takes `action`, the id of an action of the registry: the button runs it and its tooltip shows the keys. With `collapse`, `[` collapses and opens the secondary pane of a `SplitPane` at the left, and `]` the one at the right; the rail gets the focus when the focused pane collapses. `ListDetail.Split` takes `detail.onReopen`: `]` closes the open row and opens the last one again. `useOpenRowRoute` gives `reopen`, and `useReopenLastRow` gives it for an open row that is not in the URL. `Toolbar.GoBack` takes `action`: its tooltip shows the keys of the action.

### Patch Changes

- A `Dropdown.Option` with `action` follows the state of its action: the option is disabled while the action gives a `disabledReason`, with the reason in its tooltip, and an option of an action that does not exist now is disabled. `useAction` takes an `origin` element, as `useRunAction` does: in a region, it gives the action of that region.
- Highlight the row under the pointer in a `CardList` to read
  
  In a `CardList` with `actionsVisibility="always"`, the row under the pointer
  gets the hover surface, thus the eye can follow a row to its value at the
  end. Only devices that can hover get it, and the cursor does not change.
- Show a `UsageRing` within the limit in gray
  
  Within the limit, the fill of the ring is the gray of an icon, not the
  accent color, thus in a list of limits only a ring over the limit catches
  the eye. Over the limit, the ring keeps the amber color, or the red color
  with `blocked`. `UsageMeter` does not change.
- A thin gap between the kicker, the title and the details of an `EntityRow` with `layout="row"`: the lines do not touch.
- The plugins use ABC Oracle, the font of the CMS, in place of Colfax. The font comes from `https://www.datocms.com/fonts/ABCOracleVariable.woff2`: if your plugin has a Content Security Policy, allow `font-src https://www.datocms.com`. The weight tokens are the ones of the CMS: `--font-weight-regular` is 340 and `--font-weight-strong` is 400.
- A `Dropdown.Option` with `action` in a menu out of the rows of a list runs the action of the page, not the action of a row with the same id. With an `origin`, `useAction` and `useRunAction` count only the regions that hold the origin: before, while the menu was open, the action of the last row won.
- Make `Tooltip` and the keys of its shortcut smaller, and fade `Tooltip` in and out
  
  The label of a tooltip uses the extra small font size, and the box has the
  small spacing on all the sides. A key of `Shortcut` is a square of 1.5em, with a
  smaller gap between the keys. Thus a tooltip takes less space and does not
  compete with the content around it.
  
  A tooltip opens after the pointer stays on its trigger for 450ms. Thus a
  tooltip does not flash while the pointer moves across a toolbar. In a
  `TooltipDelayGroup`, the next tooltip still opens immediately. A tooltip fades
  in and grows in 100ms when it opens, and fades out in 200ms when it closes.
  When the next tooltip of the group opens, the tooltip before it closes with no
  fade.
- Updated dependencies
  - datocms-plugin-sdk@2.6.0-next.1

## 3.1.0-next.0

### Minor Changes

- **Breaking:** build the components from the components of the DatoCMS interface
  
  This is a new major line, and it starts at 3.1.0: npm has two old 3.0 alphas, which are deprecated. react-ui 3 is a new library. Its components are the components of the CMS itself, thus a plugin looks and behaves like the CMS around it.
  
  - Import the CSS once, and each component from its own path: `import Button from 'datocms-react-ui/Button'`. There is no root import.
  - Put a `Canvas` around the content of each hook that renders in a frame, as in 2.x. The components read the host through it.
  - The names and the props of the components change. See the `README.md` of the package.

### Patch Changes

- Updated dependencies
  - datocms-plugin-sdk@2.6.0-next.0
