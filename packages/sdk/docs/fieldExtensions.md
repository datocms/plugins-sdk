By creating what we call 'field extensions', plugins can change the way in which the field of a record is presented to the final editor, going beyond the binaries provided by default by DatoCMS.

### Different types of field extensions

There are different types of field extensions that can be created, depending on requirements:

#### "Editor" extensions

They operate on top of a particular field, replacing the default field editor that DatoCMS provides with custom code. The use cases are varied, and many examples are already on our marketplace, ready to be installed on your project:

- The [Shopify product](/marketplace/plugins/i/datocms-plugin-shopify-product) plugin can be hooked into string fields and completely changes the interface to allow you to browse the products in your Shopify store, then save the ID of the selected product in the string field itself;
- The [Hidden field](/marketplace/plugins/i/datocms-plugin-shopify-product) plugin simply hides a specific field from the editor's eyes, while the [Conditional fields](/marketplace/plugins/i/datocms-plugin-conditional-fields) plugin shows/hides a number of fields when you toggle a particular checkbox field.

It is also possible to have editor extensions in "sidebar mode": the effect is to move the field to the right-hand sidebar, giving it the appearance of a collapsible panel. As an example, the [Sidebar notes](/marketplace/plugins/i/datocms-plugin-notes) plugin uses this mode to turn a JSON field into a kind of notepad where you can add virtual post-it notes.

#### "Addon" extensions

As the name suggests, addons do not change the way a field is edited, but they add functionality, or provide additional information, directly below the field editor. While only one editor can be set up for each field, it is possible to have several addons per field, each providing its own different functionality.

As examples of use, [Yandex Translate](/marketplace/plugins/i/datocms-plugin-yandex-translate) adds a button below your localisable text/string fields to automatically translate its content from one locale to another, while [Sanitize HTML](/marketplace/plugins/i/datocms-plugin-sanitize-html) allows you to clean up the HTML code present in a text field according to various preferences.

### How to hook field extensions to a field

The SDK provides an [`overrideFieldExtensions`](#overrideFieldExtensions) hook that can be implemented to take part in the rendering of any field within the form, either by setting its editor, or by adding addons, or both.

In this example, we are forcing the use of the `starRating` editor for all integer fields that have an ID of `rating`:

```ts
import { connect, Field, FieldInitCtx } from 'datocms-plugins-sdk';

connect({
  overrideFieldExtensions(field: Field, ctx: FieldInitCtx) {
    if (field.attributes.field_type === 'integer' && field.attributes.api_key === 'rating') {
      return {
        editor: { id: 'starRating' },
      };
    }
  },
});
```

Similarly, we can also add an addon extension called `loremIpsumGenerator` below all the text fields:

```ts
overrideFieldExtensions(field: Field, ctx: FieldInitCtx) {
  if (field.attributes.field_type === 'text') {
    return {
      addons: [
        { id: 'loremIpsumGenerator' },
      ],
    };
  }
}
```

### Rendering the field extension

At this point, we need to actually render the field extensions by implementing the [`renderFieldExtension`](#renderFieldExtension) hook.

Inside of this hook we can implement a simple "router" that will render a different React component depending on the field extension that we're requested. We also make sure to pass down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderFieldExtensionCtx } from 'datocms-plugins-sdk';

function render(component: React.ReactNode) {
  ReactDOM.render(
    <React.StrictMode>{component}</React.StrictMode>,
    document.getElementById('root'),
  );
}

connect({
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'starRating':
        return render(<StarRatingEditor ctx={ctx} />);
      case 'loremIpsumGenerator':
        return render(<LoremIpsumGenerator ctx={ctx} />);
    }
  },
});
```

The implementation of the Lorem Ipsum component is pretty straightforward: we simply use the `ctx.setFieldValue` function to change the value of the field into a randomly generated string:

```ts
import { loremIpsum } from 'lorem-ipsum';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

function LoremIpsumGenerator({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, []);

  const insertLoremIpsum = () => {
    ctx.setFieldValue(ctx.fieldPath, loremIpsum({ format: 'plain' }));
  };

  return (
    <button type="button" onClick={insertLoremIpsum}>
      Add lorem ipsum
    </button>
  );
}
```

Since our addon extension is rendered inside an iframe, it is important to call `ctx.startAutoResizer()` at the first mount of our component, so that the iframe will continuously auto-adjust its size based on the content we're rendering.

The Star Rating component is pretty similar, we get the current field value from `ctx.formValues` and the disabled state from `ctx.disabled`. When the user interacts with the component and changes its value, we call `ctx.setFieldValue` to propagate the change to the main DatoCMS application:

```ts
import ReactStars from 'react-rating-stars-component';
import get from 'lodash/get';

function StarRatingEditor({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, []);

  const currentValue = get(ctx.formValues, ctx.fieldPath);

  const handleChange = (newValue) => {
    ctx.setFieldValue(ctx.fieldPath, newValue);
  };

  return (
    <ReactStars
      count={5}
      isHalf={false}
      edit={ctx.disabled}
      value={currentValue || 0}
      onChange={handleChange}
    />
  );
}
```

### Adding user-defined settings into the mix

You might have noticed that our plugin is currently hardcoding some choices, namely:

- the rules that decide when to apply both our "star rating" and "lorem ipsum" extensions;
- the maximum number of stars to show;
- the lenght of the "lorem ipsum" text we're generating;

If we want, we could make these settings configurable by the user, either by implementing some [global plugin settings](/docs/plugin-sdk/sdk/settings), or by transforming our field extensions into ["manual" extensions](/docs/plugin-sdk/sdk/manual-field-extensions).

When to use one strategy or the other is completely up to you, and each has its own advantages/disadvanges

- Manual field extensions are manually hooked by the end-user on each field, and for each installation different configuration options can be specified. Given that our star rating extension will most likely be used in a few specific places rather than in all integer fields of the project, manual fields might be the best choice.
- On the other hand, our Lorem Ipsum generator may be convenient in all text fields, so requiring the end user to manually install it everywhere would be unnecessarily tedious. In this case, the choice to force the addon on all fields with the [`overrideFieldExtensions`](#overrideFieldExtensions) hook is probably the right one.
