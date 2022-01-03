# vite-plugin-twig

[Vite](https://github.com/vitejs/vite) plugin for [Twig](https://github.com/twigjs/twig.js/).

---

## Installation
```
npm i -D vite-plugin-twig
```


## Usage

```js
/* vite.config.js */
import twig from 'vite-plugin-twig'

export default {
  plugins: [
    twig()
  ]
}
```

### Options
An options object can also be passed as argument with the properties listed here below.

#### `filters`
__type__ `{ [key: string]: (...args: any[]) => any }`

__default__ `{}`

A collection of custom filters to extend *Twig*. Look at [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/Extending-twig.js) to learn more.


#### `functions`
__type__ `{ [key: string]: (...args: any[]) => any }`

__default__ `{}`

A collection of custom functions to extend *Twig*. Look at [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/Extending-twig.js) to learn more.

#### `globals`
__type__ `{ [key: string]: any }`

__default__ `{}`

The global variables to be injected in each template.

#### `settings`
__type__ `{ [key: string]: any }`

__default__ `{}`

The *Twig* settings. Please refer to [*twig.js* documentation](https://github.com/twigjs/twig.js/wiki/) to learn more.


### Templates
The *html* files located by default in the *Vite* project root are not intented to be replaced directly by the *twig* ones as the normal page files resolution/linking on the *Vite*'s dev server is wanted to be preserved along with the build logic. However, those files are supposed to contain a json definition instead of the traditional markup, which should be moved on the *twig* side.

More in details, a *html* file should look like this:

```html
<!-- index.html -->
<script type="application/json">
  {
    "template": "path/to/template.twig",
    "data": {
      "title": "Homepage"
    }
  }
</script>
```

where `template` is the path of the *twig* template to be rendered (relative to the *cwd*), and `data` is the local context for that page (eventually merged with the *globals* provided via plugin options).