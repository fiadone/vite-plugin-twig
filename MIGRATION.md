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


### 3. [Breaking change] __*Twig*'s extensions are now wrapped in the *extensions* property within the configuration.__

Replace this:
```js
/* vite.config.js */
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'

export default defineConfig({
  // ...
  plugins: [
    twig({
      // ...
      filters: {
        // ...
      },
      functions: {
        // ...
      }
    })
  ]
})
```

with this:
```js
/* vite.config.js */
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'

export default defineConfig({
  // ...
  plugins: [
    twig({
      // ...
      extensions: {
        filters: {
          // ...
        },
        functions: {
          // ...
        }
      }
    })
  ]
})
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


### 5. [New option] __Via the *fileFilter* option, now the plugin provides a custom way to determine if the current transforming .html file should be processed/ignored or not__

```js
/* vite.config.js */
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'

export default defineConfig({
  // ...
  plugins: [
    twig({
      // ...
      fileFilter: filename => {
        // your custom logic
        return true // or false
      }
    })
  ]
})

```


### 6. [New option] __Via the *fragmentFilter* option, now the plugin provides a custom way to determine if a matched fragment should be processed/ignored or not__

```js
/* vite.config.js */
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'

export default defineConfig({
  // ...
  plugins: [
    twig({
      // ...
      fragmentFilter: (fragment, template, data) => {
        // your custom logic
        return true // or false
      }
    })
  ]
})

```


### 7. [New feature] __Multiple *script* tags are now supported within the same *.html* file and can live together with standard *HTML* code.__

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