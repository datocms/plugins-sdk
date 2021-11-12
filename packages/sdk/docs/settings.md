Quite often, plugins need to offer a set of configuration options to the user who installs it.

DatoCMS offers to every plugin a **read-write object that can be used to store such settings**. It is a free-form object, with no restrictions in the format. Plugins can store what they want in it, and retrieve its value anytime they need in any hook.

As the configuration parameters are completely arbitrary, **it is up to the plugin itself to show the user a form** through which they can be changed.

The hook provided for this purpose is called [`renderPluginParametersForm`](#renderPluginParametersForm), and it will be called by DatoCMS when the user visits the details page of the installed plugin:

[SCREENSHOT DEL RISULTATO]

#### Implementing a simple configuration form

To give a very simple example, let's say our plugin wants to provide the end user with a simple boolean flag called `debugMode`. If this flag is enabled, then the plugin will display a series of debug messages in the console as it works.

The first step is to implement the [`renderPluginParametersForm`](#renderPluginParametersForm) hook, which will simply initialize React by rendering a custom component called `PluginParametersForm`:

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderPluginParametersFormCtx } from 'datocms-plugins-sdk';

connect({
  renderPluginParametersForm(ctx: RenderPluginParametersFormCtx) {
    ReactDOM.render(
      <React.StrictMode>
        <PluginParametersForm ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

The hook, in its `ctx` argument, provides a series of information and methods for interacting with the main application, and for now all we'll just pass the whole object to the component, in the form of a React prop:

```ts
import { useEffect } from 'react';

type PropTypes = {
  ctx: RenderPluginParametersFormCtx;
};

function PluginParametersForm({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, []);

  return <div>Hi!</div>;
}
```

Since our plugin is rendered inside an iframe, it is important to call `ctx.startAutoResizer()` at the first mount of our component, so that the iframe will continuously auto-adjust its size based on the content we're rendering.

It is now time to setup our form, using one of the many form management libraries that React offers (in this case [`react-hook-form`](https://react-hook-form.com/)):

```ts
import { useForm } from 'react-hook-form';

function PluginParametersForm({ ctx }: PropTypes) {
  const { register, handleSubmit } = useForm({
    defaultValues: ctx.plugin.attributes.parameters,
  });

  const onSubmit = (newParameters) => ctx.save(newParameters);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input {...register('debugMode')} type="checkbox" />
        Enable debug mode?
      </label>

      <input type="submit" />
    </form>
  );
}
```

The important thing to notice is that we can access the currently saved configuration object through `ctx.plugin.attributes.parameters` — this will be the initial value of our form — and inside the `onSubmit` callback, we can call `ctx.save()` to ask DatoCMS to update the configuration object with some new values.

Saved settings are always available as `ctx.plugin.attributes.parameters` in any of the other hooks, so that your plugin can have different behaviours based on them.
