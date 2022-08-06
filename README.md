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
    twig({ /* ...options */ })
  ]
})
```

### Options
The plugin can be configured both directly with the options parameter shown above or via the dedicated *twig.config.(js|ts)* file, like following:

```js
/* twig.config.js */
import { defineConfig } from 'vite-plugin-twig'

export default defineConfig({
  // ...
})
```

> ℹ️ *defineConfig* is a bypass function with type hints, which means you can also omit it if you don't need the autocompletion/typecheck.

Here below the list of the supported options.

#### `cache`
__type:__ `boolean`

__default:__ `false`

If *true*, it enables internal *Twig*'s template caching.

#### `extensions`
__type:__ `{ filters: TwigExtensions, functions: TwigExtensions }`

__default:__ `undefined`

A collection of custom filters and functions to extend *Twig*. Look at [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/Extending-twig.js) to learn more.

#### `fileFilter`
__type:__ `(filename: string) => boolean`

__default:__ `undefined`

A custom filter to determine if the current transforming *.html* file should be processed/ignored or not (useful for improving compatibility with other plugins).

Example:
```js
/* twig.config.js */
import { defineConfig } from 'vite-plugin-twig'

export default defineConfig({
  // ...
  fileFilter: filename => filename.endsWith('.twig.html')
})
```

#### `fragmentFilter`
__type:__ `TwigFragmentFilter`

__default:__ `undefined`

A custom filter to determine if the current matched fragment should be processed/ignored or not (useful for improving compatibility with other plugins).

Example:
```js
/* twig.config.js */
import { defineConfig } from 'vite-plugin-twig'

export default defineConfig({
  // ...
  fragmentFilter: (fragment, template, data) => {
    return fragment.indexOf('data-engine="twig"') > -1
    // or  template.endsWith('.twig')
    // or  data.engine === 'twig'
  }
})
```

#### `globals`
__type:__ `{ [key: string]: any }`

__default:__ `undefined`

The global variables to be injected in each template.

#### `settings`
__type:__ `{ views: any, 'twig options': any }`

__default:__ `undefined`

The *Twig* settings. Please refer to *twig.js* [documentation](https://github.com/twigjs/twig.js/wiki/) and [types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/twig/index.d.ts) to learn more.


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
