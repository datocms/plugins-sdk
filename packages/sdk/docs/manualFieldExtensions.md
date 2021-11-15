In the [previous chapter](/docs/plugin-sdk/sdk/field-extensions):

- we saw the different types of field extensions we can create ([editors](/docs/plugin-sdk/sdk/field-extensions#editor-extensions) and [addons](/docs/plugin-sdk/sdk/field-extensions#addon-extensions));
- we've seen how we can programmatically associate a particular extension to one (or multiple) fields;
- we used the [`renderFieldExtension`](/docs/plugin-sdk/sdk/field-extensions#rendering-the-field-extension) hook to actually render our extensions.

If you haven't read the chapter, we encourage you do it, as we're going to build up on the same "Star rating" and "Lorem ipsum generator" field extension examples!

### "Forced" field extensions vs manual field extensions

In previous examples, we have used the [`overrideFieldExtensions`](/docs/plugin-sdk/sdk/field-extensions#how-to-hook-field-extensions-to-a-field) hook to programmatically apply our extensions to fields. There is an alternative way of working with field extensions that passes through a second hook that you can implement, namely [`manualFieldExtensions`](#manualFieldExtensions):

```ts
import { connect, Field, InitCtx } from 'datocms-plugins-sdk';

connect({
  manualFieldExtensions(ctx: InitCtx) {
    return [
      {
        id: 'starRating',
        name: 'Star rating',
        type: 'editor',
        fieldTypes: ['integer'],
      },
    ];
  },
  overrideFieldExtensions(field: Field, ctx: FieldInitCtx) {
    if (field.attributes.field_type === 'text') {
      return {
        addons: [{ id: 'loremIpsumGenerator' }],
      };
    }
  },
});
```

With this setup, we are still automatically applying our "Lorem ipsum" generator to every text field in our project, but the "Star rating" is becoming a manual extension. That is, **it's the end-user that will have to manually apply** it on one or more fields of type "integer" through the "Presentation" tab in the field settings:

[VIDEO?]

### When to use one strategy or the other?

At this point a question may arise... when does it make sense to force an extension with `overrideFieldExtensions` and when does it make sense to let the user install it manually? Well, it all depends on the type of extension you're developing, and what you imagine to be the most comfortable and natural way to offer its functionality!

Let's try to think about the extensions we have developed so far, and see what would be the best strategy for them.

Given that the "Star rating" extension will most likely be used in a few specific spots, rather than in all integer fields of the project, letting the user manually apply it when needed feels like the best choice.

On the other hand, our "Lorem Ipsum generator" is probably convenient in all text fields: requiring the end user to manually install it everywhere could be unnecessarily tedious, so the choice to programmatically force the addon on all text fields is probably the right one.

If we feel that a carpet-bombing strategy for the "Lorem ipsum" extension might bee too much, and we wanted to make the installation more granular but still automatic, we could add some [global settings](/docs/plugin-sdk/sdk/settings) to the plugin to allow the user to configure some application rules (ie. "only add the addon if the API key of the text field ends with `_main_content`"):

```ts
overrideFieldExtensions(field: Field, ctx: FieldInitCtx) {
  // get the suffix from plugin configuration settings
  const { loremIpsumApiKeySuffix } = ctx.plugin.attributes.parameters;

  if (
    field.attributes.field_type === 'text' &&
    field.attributes.api_key.endsWith(loremIpsumApiKeySuffix)
  ) {
    return {
      addons: [
        { id: 'loremIpsumGenerator' },
      ],
    };
  }
}
```

If you can't make up your mind on the best strategy for your field extension, there's always a third option: let the end user be in charge of the decision! Plugin settings are always available in every hook, so you can read the user preference and act accordingly:

```ts
import { connect, Field, InitCtx } from 'datocms-plugins-sdk';

connect({
  manualFieldExtensions(ctx: InitCtx) {
    const { autoApply } = ctx.plugin.attributes.parameters;

    if (autoApply) {
      return [];
    }

    return [
      {
        id: 'starRating',
        name: 'Star rating',
        type: 'editor',
        fieldTypes: ['integer'],
      },
      {
        id: 'loremIpsumGenerator',
        name: 'Lorem Ipsum generator',
        type: 'addon',
        fieldTypes: ['text'],
      },
    ];
  },
  overrideFieldExtensions(field: Field, ctx: FieldInitCtx) {
    const { autoApply } = ctx.plugin.attributes.parameters;

    if (!autoApply) {
      return;
    }

    if (field.attributes.field_type === 'text') {
      return {
        addons: [{ id: 'loremIpsumGenerator' }],
      };
    }

    if (
      field.attributes.field_type === 'integer' &&
      field.attributes.api_key === 'rating'
    ) {
      return {
        editor: { id: 'starRating' },
      };
    }
  },
});
```

### Add per-field configuration options to manual field extensions

While exposing the manual extensions that our plugin offers, with the `configurable: true` option we can declare that we want to present some configuration options to the user when they're installing the extension on a field:

```ts
import { connect, Field, InitCtx } from 'datocms-plugins-sdk';

connect({
  manualFieldExtensions(ctx: InitCtx) {
    return [
      {
        id: 'starRating',
        name: 'Star rating',
        type: 'editor',
        fieldTypes: ['integer'],
        configurable: true,
      },
    ];
  },
});
```

Just like global plugin settings, these per-field configuration parameters are completely arbitrary, so it is up to the plugin itself to show the user a form through which they can be changed.

To continue our example, let's take our "Star rating" editor and say we want to offer end-users the ability, on a per-field basis, to specify the maximum number of stars that can be selected and the color of the stars.

The hook provided to render the configuration form is [`renderManualFieldExtensionParametersForm`](#renderManualFieldExtensionParametersForm), and it will be called by DatoCMS when the selects our configurable manual extension for a particular field.

Inside the hook we'll simply initialize React and a custom component called `StarRatingParametersForm`. The argument `ctx` provides a series of information and methods for interacting with the main application, and for now all we'll just pass the whole object to the component, in the form of a React prop:

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
  RenderManualFieldExtensionParametersFormCtx,
} from 'datocms-plugins-sdk';

connect({
  renderManualFieldExtensionParametersForm(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionParametersFormCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <StarRatingParametersForm ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

This is how our form component looks like:

```ts
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type PropTypes = {
  ctx: RenderManualFieldExtensionParametersFormCtx;
};

function StarRatingParametersForm({ ctx }: PropTypes) {
  useEffect(() => {
    ctx.startAutoResizer();

    ctx.setParameters({
      maxRating: ctx.parameters.maxRating || 5,
      starsColor: ctx.parameters.starsColor || 'yellow',
    });
  }, []);

  return (
    <>
      <div>
        <label htmlFor="maxRating">Maximum rating</label>
        <input
          type="text"
          name="maxRating"
          value={ctx.parameters.maxRating}
          onChange={(e) => {
            ctx.setParameters({
              ...ctx.parameters,
              maxRating: parseInt(e.target.value),
            });
          }}
        />
      </div>
      <div>
        <label htmlFor="starsColor">Stars color</label>
        <input
          type="text"
          name="starsColor"
          value={ctx.parameters.starsColor}
          onChange={(e) => {
            ctx.setParameters({
              ...ctx.parameters,
              starsColor: e.target.value,
            });
          }}
        />
      </div>
    </>
  );
}
```

At the first mount of our component, we're calling `ctx.startAutoResizer()` so that the iframe will continuously auto-adjust its size based on the content we're rendering, and we're also setting a default value for our options if none are specified.

As the user changes values for the inputs, we're using `ctx.setParameters()` to propagate the change to the main DatoCMS application.

### Enforcing validations on configuration options

Users might insert invalid values for the options we present. We can implement another hook called [`validateManualFieldExtensionParameters`](#validateManualFieldExtensionParameters) to enforce some validations on them:

```ts
const isValidCSSColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
};

connect({
  validateManualFieldExtensionParameters(
    fieldExtensionId: string,
    parameters: Record<string, any>,
  ) {
    const errors: Record<string, string> = {};

    if (parameters.maxRating < 2 || parameters.maxRating > 10) {
      errors.starsColor = 'Stars can be between 2 and 10!';
    }

    if (!isValidCSSColor(parameters.starsColor)) {
      errors.starsColor = 'Invalid CSS color!';
    }

    return errors;
  },
});
```

Inside our component, we can get those errors and present them below the input fields:

```ts
function StarRatingParametersForm({ ctx }: PropTypes) {
  // ...

  return (
    <>
      <div>
        <label htmlFor="maxRating">Maximum rating</label>
        <input type="text" name="maxRating" /* ... */ />
        {ctx.errors.maxRating && <div>{ctx.errors.maxRating}</div>}
      </div>
      <div>
        <label htmlFor="starsColor">Stars color</label>
        <input type="text" name="starsColor" /* ... */ />
        {ctx.errors.starsColor && <div>{ctx.errors.starsColor}</div>}
      </div>
    </>
  );
}
```
