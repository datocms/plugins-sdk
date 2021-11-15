Within the form for editing a record, it can be convenient to have some contextual information to keep an eye on while you are writing, without having to keep several tabs open or interrupt the flow.

Through plugins it is possible to add a series of additional and fully customisable panels to the sidebar on the right of the editing form. A sidebar panel is nothing more than an iframe, inside of which the plugin developer can render what they prefer, while also having the possibility to:

- access a series of information relating to the record that's being edited, the project in which the plugin is installed or the logged-in user;
- make calls to DatoCMS to produce various effects and interacting with the main application (changing form values, navigate to other pages, trigger notifications, opening modals, etc.);

[SCREENSHOT DEL RISULTATO]

### Implementing a simple sidebar panel

To give a very simple example, let's say we want to create a sidebar panel that will show a link pointing to the website page related to the record we're editing. The first step is to implement the [`itemFormSidebarPanels`](#itemFormSidebarPanels) hook, to add the panel to the sidebar:

```ts
import { connect, InitCtx } from 'datocms-plugins-sdk';

connect({
  itemFormSidebarPanels(model: ModelBlock, ctx: InitCtx) {
    return [
      {
        id: 'goToWebsite',
        label: 'Go to website',
        startOpen: true,
      },
    ];
  },
});
```

The code above will add a panel to every record in our project... but maybe not every record in DatoCMS has a specific page in the final website, right? It might be better to [add some settings to our plugin](/docs/plugin-sdk/sdk/settings) to let the final user declare the set of models that have permalinks, and the relative URL structure enforced on the frontend:

```ts
itemFormSidebarPanels(model: ModelBlock, ctx: InitCtx) {
  const { permalinksByModel } = ctx.plugin.attributes.parameters;

  // Assuming we're saving user preferences in this format:
  // {
  //   'blog_post': '/blog/:slug',
  //   'author': '/author/:slug',
  //   ...
  // }
  }

  if (!permalinksByModel[model.attributes.api_key]) {
    // Don't add the panel!
    return [];
  }

  // Add the panel!
}
```

#### Rendering the panel

The final step is to actually render the panel itself by implementing the [`renderItemFormSidebarPanel`](#renderItemFormSidebarPanel) hook.

Inside of this hook we initialize React and render a custom component called `GoToWebsiteItemFormSidebarPanel`, passing down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderItemFormSidebarPanelCtx } from 'datocms-plugins-sdk';

connect({
  renderItemFormSidebarPanel(
    sidebarPaneId,
    ctx: RenderItemFormSidebarPanelCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <GoToWebsiteItemFormSidebarPanel ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

A plugin might render different panels, so we can use the `sidebarPaneId` argument to know which one we are requested to render, and write a specific React component for each of them.

```ts
import { useEffect } from 'react';

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

function GoToWebsiteItemFormSidebarPanel({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, []);

  return <div>Hi!</div>;
}
```

Since our panel is rendered inside an iframe, it is important to call `ctx.startAutoResizer()` at the first mount of our component, so that the iframe will continuously auto-adjust its size based on the content we're rendering.

All we need to do now is to actually render the link to the website, reading the state of the record that's being edited:

```ts
function GoToWebsiteItemFormSidebarPanel({ ctx }: PropTypes) {
  // ...

  if (ctx.itemStatus === 'new') {
    // we're in a record that still has not been persisted
    return <div>Please save the record first!</div>;
  }

  const { permalinksByModel } = ctx.plugin.attributes.parameters;
  const permalinkStructure = permalinksByModel[ctx.itemType.attributes.api_key];
  const url = permalinkStructure.replace(':slug', ctx.formValues.slug);

  return (
    <a href={url} target="_blank">
      View it on the website!
    </a>
  );
}
```
