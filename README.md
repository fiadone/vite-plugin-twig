# vite-plugin-twig

[Vite](https://github.com/vitejs/vite) plugin for [Twig](https://github.com/twigjs/twig.js/).

---

## ⚠️ Notice
This documentation refers to the version *2.x* of the plugin. Take a look [here](./README-v1.md) for older releases or check out the [migration guide](./MIGRATION.md).


## Installation
```
npm i -D vite-plugin-twig
```


## Usage

```js
/* vite.config.js */
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'

export default defineConfig({
  // ...
  plugins: [
    twig()
  ]
})
```

### Options
The plugin can be configured both via the *twig.config.js* file from the project root or by passing a configuration object directly as argument to the function above (in this last case, the configuration file will be ignored).

Here below the list of the supported options.

#### `cache`
__type__ `Boolean`

__default__ `false`

If *true*, it enables internal *Twig*'s template caching.

#### `filters`
__type__ `{ [key: String]: (...args: Any[]) => Any }`

__default__ `{}`

A collection of custom filters to extend *Twig*. Look at [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/Extending-twig.js) to learn more.

#### `functions`
__type__ `{ [key: String]: (...args: Any[]) => Any }`

__default__ `{}`

A collection of custom functions to extend *Twig*. Look at [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/Extending-twig.js) to learn more.

#### `globals`
__type__ `{ [key: String]: Any }`

__default__ `{}`

The global variables to be injected in each template.

#### `settings`
__type__ `{ [key: String]: Any }`

__default__ `{}`

The *Twig* settings. Please refer to [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/) to learn more.


### Templates
The *.html* files located by default in the *Vite* project root are not intented to be replaced directly by the *.twig* ones since the normal page files resolution/linking on the *Vite*'s dev server is wanted to be preserved along with the build logic. However, those files are enabled to contain special *script* tags which will be treated as placeholders for contents you want to delegate to *Twig*.

More in details, a *.html* file could look like this:

```html
<!-- index.html -->
<script type="application/json" data-template="path/to/template.twig">
  {
    "foo": "bar"
  }
</script>
```

where the `data-template` attribute defines the path (relative to the *cwd*) of the *.twig* file to be rendered in place of the *script* tag, whose content (optional) represents instead a *JSON* definition of the local context to be injected in the template (possibly merged with the *globals* provided via plugin options).

Take a look [here](./playground/index.html) for a clearer example.

> ℹ️ The *application/json* type is not mandatory, but it is recommended for syntax highlighting and linting purposes.

The plugin also supports a promiscuous templates handling, allowing you:
- to have *.html* files with both standard and *Twig* based code
- to render (multiple) *Twig* fragments within a standard *.html* page

This could be useful, for instance, when you want to use *Twig* for new implementations without having to refactor an existing code base.

With that in mind, a *.html* file could look as follows:

```html
<html>
  <body>

    <!-- existing contents -->

    <script type="application/json" data-template="path/to/fragment-a.twig">
      {
        "foo": "bar"
      }
    </script>

    <!-- existing contents -->

    <script type="application/json" data-template="path/to/fragment-b.twig"></script>

    <!-- existing contents -->
    
  </body>
</html>
```

Take a look [here](./playground/fragments.html) for a clearer example.
