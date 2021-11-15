Within all the `renderXXX` hooks, i.e. those that have the task of presenting a custom interface part to the user, it is possible to open custom modal dialogs to "get out" of the reduced space that the iframe provides, and get more room to build more complex interfaces.

Suppose our plugin implements a [custom page](/docs/plugin-sdk/sdk/custom-pages) accessible from the top navigation bar:

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
  mainNavigationTabs(ctx: InitCtx) {
    return [
      {
        label: 'Welcome',
        icon: 'igloo',
        pointsTo: {
          pageId: 'welcome',
        },
      },
    ];
  },
  renderPage(pageId, ctx: RenderPageCtx) {
    switch (pageId) {
      case 'welcome':
        return render(<WelcomePage ctx={ctx} />);
    }
  },
});

type PropTypes = {
  ctx: RenderPageCtx;
};

function WelcomePage({ ctx }: PropTypes) {
  return <div>Hi!</div>;
}
```

Within the `ctx` argument you can use the function `ctx.openModal()` to trigger the opening of a modal:

```ts
function WelcomePage({ ctx }: PropTypes) {
  const handleOpenModal = async () => {
    const result = await sdk.openModal({
      id: 'customModal',
      title: 'Custom title!',
      size: 'l',
      parameters: { name: 'Mark' },
    });
  };

  return (
    <div>
      Hi!
      <button type="button" onClick={handleOpenModal}>
        Open modal!
      </button>
    </div>
  );
}
```

The `openModal()` function offers various rendering options, for example you can set a "standard" modal size (`s`, `m`, `l`, `fullWidth`) or specify a custom width in pixels.

Interestingly, the function returns a promise, which will be resolved when the modal is closed by the user.

You can specify what to render inside the modal by implementing a new hook called [`renderModal`](#renderModal) which, similarly to what we did with custom pages, initializes React with a custom component:

```ts
connect({
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (pageId) {
      case 'customModal':
        return render(<CustomModal ctx={ctx} />);
    }
  },
});
```

You are free to fill the modal with the information you want, and you can access the parameters specified when opening the modal through `ctx.parameters`:

```ts
type PropTypes = {
  ctx: RenderModalCtx;
};

function CustomModal({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, []);

  return <div>Hello {ctx.parameters.name}!</div>;
}
```

### Closing the modal

If the modal will be closed through the "close" button provided by the interface, the promise `openModal()` will be resolved with value `null`.

You can also decide not to show a "close" button:

```ts
const result = await sdk.openModal({
  id: 'customModal',
  // ...
  closeDisabled: true,
});
```

In this case the user will only be able to close the modal via an interaction of your choice (custom buttons, for example):

```ts
function CustomModal({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, []);

  const handleClose = (returnValue) => {
    ctx.resolve(returnValue);
  }

  return (
    <div>
      Hello {ctx.parameters.name}!
      <button type="button" onClick={handleClose.bind(null, 'a')}>Close A<button>
      <button type="button" onClick={handleClose.bind(null, 'b')}>Close B<button>
    </div>;
}
```

The `ctx.resolve()` function will close the modal, and resolve the original `openModal()` promise with the value you passed.
