# Migration guide

## From *v1.x* to *v2.x*

### 1. [Breaking change] __The template path has been moved to the *script* tag's `data-template` attribute.__

Replace this:
```html
<script type="application/json">
  {
    "template": "path/to/template.twig",
    "data": {
      "foo": "bar"
    }
  }
</script>
```

with this:
```html
<script type="application/json" data-template="path/to/template.twig">
  {
    "foo": "bar"
  }
</script>
```

> ℹ️ The *data* property is no longer required in the *JSON* schema.


### 2. [Breaking change] __Plain text content is no longer supported within *.html* files.__

Replace this:
```json
{
  "template": "path/to/template.twig",
  "data": {
    "foo": "bar"
  }
}
```

with this:
```html
<script type="application/json" data-template="path/to/template.twig">
  {
    "foo": "bar"
  }
</script>
```


### 3. [New feature] __Multiple *script* tags are now supported within the same *.html* file and can live together with standard *HTML* code.__

```html
<html>
  <body>

    <!-- other html contents -->

    <script type="application/json" data-template="path/to/fragment-a.twig">
      {
        "foo": "bar"
      }
    </script>

    <!-- other html contents -->

    <script type="application/json" data-template="path/to/fragment-b.twig"></script>

    <!-- other html contents -->
    
  </body>
</html>
```


### 4. [New option] __*Twig*'s internal template caching is now configurable.__

```js
/* vite.config.js */
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'

export default defineConfig({
  // ...
  plugins: [
    twig({
      // ...
      cache: true
    })
  ]
})

```
or
```js
/* twig.config.js */
module.exports = {
  // ...
  cache: true
}
```
