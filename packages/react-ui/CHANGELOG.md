# datocms-react-ui

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
