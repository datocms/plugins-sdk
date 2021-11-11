Through plugins it is possible to enrich the functionalities of DatoCMS by adding new pages and sections to the standard interface. These pages are **100% customisable**, and the end user can reach them through links/menu items that can be added to the different DatoCMS navigation menus.

A page is nothing more than a full screen iframe, inside of which the plugin developer can render what they prefer, while also having the possibility to:

- access a series of information relating to the project in which the plugin is installed or the logged-in user;
- make calls to DatoCMS to produce various effects and interacting with the main application (ie. navigate to other pages, trigger notifications, opening modals, etc.);

### Step 1: Adding a navigation menu item to access the custom page

The SDK provides a number of hooks for adding links to custom pages within the navigation menus of DatoCMS.

#### Option 1: Top-bar navigation items

To add one or more tabs to the top bar of the interface, you can use the [`mainNavigationTabs`](#mainNavigationTabs) hook:

```ts
import { connect, InitCtx } from 'datocms-plugins-sdk';

connect({
  mainNavigationTabs(ctx: InitCtx) {
    return [
      {
        label: 'Analytics',
        icon: 'analytics',
        pointsTo: {
          pageId: 'analytics',
        },
      },
    ];
  },
});
```

The `pageId` property is crucial here, as it specifies which custom page you want to display when you click the tab. If you wish, you can also customize the insertion point of the menu item via the `placement` property:

```ts
{
  // ...other properties
  placement: ['before', 'content'],
}
```

In this case, we are asking to show the tab before the default "Content" tab:

[SCREENSHOT]

#### Option 2: Adding a menu item in the Content navigation sidebar

Similarly, we can use the [`contentAreaSidebarItems`](#contentAreaSidebarItems) hook to add menu items to the sidebar that is displayed when we are inside the "Content" area:

```ts
import { connect, InitCtx } from 'datocms-plugins-sdk';

connect({
  contentAreaSidebarItems(ctx: InitCtx) {
    return [
      {
        label: 'Welcome!',
        icon: 'igloo',
        placement: ['before', 'menuItems'],
        pointsTo: {
          pageId: 'welcome',
        },
      },
    ];
  },
});
```

This code will add a menu item above the default item menus present in the sidebar:

[SCREENSHOT]

#### Option 3: Adding a custom section in the Settings area

It is also possible to new sections in the sidebar present in the "Settings" area with the [`settingsAreaSidebarItemGroups`](#settingsAreaSidebarItemGroups) hook:

```ts
import { connect, InitCtx } from 'datocms-plugins-sdk';

const labels = {
  en: 'Settings',
  it: 'Impostazioni',
  es: 'Configuración',
};

connect({
  settingsAreaSidebarItemGroups(ctx: InitCtx) {
    if (!ctx.currentRole.attributes.can_edit_schema) {
      return [];
    }

    return [
      {
        label: 'My plugin',
        items: [
          {
            label: labels[ctx.ui.locale],
            icon: 'cogs',
            pointsTo: {
              pageId: 'settings',
            },
          },
        ],
      },
    ];
  },
});
```

In this example, it can be seen that it is possible to show (or not) menu items depending on the logged-in user's permissions, or to show labels translated into the user's preferred interface language.

[SCREENSHOT]

### Step 2: Rendering the page

Once you enter the page through one of the links, you can render the content of the custom pages by implementing the [`renderPage`](#renderPage) hook:

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderPageCtx } from 'datocms-plugins-sdk';

function render(component: React.ReactNode) {
  ReactDOM.render(
    <React.StrictMode>{component}</React.StrictMode>,
    document.getElementById('root'),
  );
}

connect({
  renderPage(pageId, ctx: RenderPageCtx) {
    switch (pageId) {
      case 'welcome':
        return render(<WelcomePage ctx={ctx} />);
      case 'settings':
        return render(<SettingsPage ctx={ctx} />);
      case 'analytics':
        return render(<AnalyticsPage ctx={ctx} />);
    }
  },
});
```

The strategy here is to implement a quick "router" that based on the `pageId` will render a different, specialized React component.

The hook, in its second `ctx` argument, provides a series of information and methods for interacting with the main application. It is a good idea to pass it to the page component, in the form of a React prop.
