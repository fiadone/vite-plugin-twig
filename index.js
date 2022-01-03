// @ts-check
const { extname } = require('path')
const { configureTwig, parseHTML, renderTemplate } = require('./tasks')

/**
 * @param {import('.').Options} options
 * @returns {import('vite').Plugin}
 */
function viteTwigPlugin({ filters = {}, functions = {}, globals = {}, settings = {} } = {}) {

  configureTwig({ filters, functions })

  return {
    name: 'vite-plugin-twig',
    transformIndexHtml: {
      enforce: 'pre',
      async transform(content) {
        const { template, data } = parseHTML(content)
        return template
          ? await renderTemplate(template, { ...globals, ...data }, settings)
          : content
      }
    },
    handleHotUpdate({ file, server }) {
      if (extname(file) === '.twig') {
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}

module.exports = viteTwigPlugin