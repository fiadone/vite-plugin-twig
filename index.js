// @ts-check
const path = require('path')
const process = require('process')
const Twig = require('twig')

/**
 * @param {import('.').Options} options
 * @returns {import('vite').Plugin}
 */
function viteTwigPlugin({
  filters = {},
  functions = {},
  globals = {},
} = {}) {
  const cwd = process.cwd()

  Twig.cache(false)

  Object.entries(filters).forEach(([key, fn]) => Twig.extendFilter(key, fn))
  Object.entries(functions).forEach(([key, fn]) => Twig.extendFunction(key, fn))

  return {
    name: 'vite-plugin-twig',
    transformIndexHtml: {
      enforce: 'pre',
      transform(content) {
        try {
          const [_, specs] = content.match(/<script\b[^>]*>([\s\S]+)<\/script>/) || []
          const { template, data } = JSON.parse(specs || content)
          const filepath = path.resolve(cwd, template)
          const context = { ...globals, ...data }

          return new Promise((resolve, reject) => {
            Twig.renderFile(filepath, context, (err, html) => {
              if (err) {
                reject(err)
              } else {
                resolve(html)
              }
            })
          })
        } catch (err) {
          console.warn(err)

          return Promise.resolve(content)
        }
      }
    },
    handleHotUpdate({ file, server }) {
      if (path.extname(file) === '.twig') {
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}

module.exports = viteTwigPlugin
