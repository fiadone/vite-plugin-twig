const process = require('process')
const path = require('path')
const Twig = require('twig')

/**
 * Retrieves options from the configuration file
 * @returns {object}
 */
function retrieveOptions() {
  try {
    const config = path.resolve(process.cwd(), 'twig.config.js')
    return require(config)
  } catch (err) {
    return {}
  }
}


/**
 * It handles Twig configuration and extension
 * @param {object} extensions
 */
function configureTwig({functions = {}, filters = {}} = {}) {
  Twig.cache(false)
  Object.entries(filters).forEach(([key, fn]) => Twig.extendFilter(key, fn))
  Object.entries(functions).forEach(([key, fn]) => Twig.extendFunction(key, fn))
}

/**
 * It handles the original html content parsing in order to retrieve the template details
 * @param {string} content
 * @param {string} basePath
 * @returns {object}
 */
function parseHTML(content, basePath = '') {
  try {
    if (/<script\b[^>]*>([\s\S]+)<\/script>/gi.test(content)) {
      const [_, specs] = content.match(/<script\b[^>]*>([\s\S]+)<\/script>/) || []
      const {template, data} = JSON.parse(specs)
      return {template: path.join(process.cwd(), basePath, template), data}
    } else {
      const {template, data} = JSON.parse(content)
      return {template: path.join(process.cwd(), basePath, template), data}
    }
  } catch (err) {
    console.warn(err)
    return {}
  }
}

/**
 * It handles the conversion from twig to html
 * @param {string} template The twig template filepath
 * @param {object} context The data to be injected in the template
 * @param {object} settings The twig settings
 * @returns {Promise}
 */
function renderTemplate(template, context, settings) {
  return new Promise((resolve, reject) => {
    Twig.renderFile(template, {...context, settings}, (err, html) => {
      if (err) {
        reject(err)
      } else {
        resolve(html)
      }
    })
  })
}

module.exports.retrieveOptions = retrieveOptions
module.exports.configureTwig = configureTwig
module.exports.parseHTML = parseHTML
module.exports.renderTemplate = renderTemplate
