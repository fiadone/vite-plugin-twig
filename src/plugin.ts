import path from 'path'
import type { Plugin } from 'vite'
import type { TwigOptions } from '../types'
import { retrieveOptionsFromConfigFile, configureTwig, parseHTML } from './tasks'

export function viteTwigPlugin(options: TwigOptions): Plugin {
  const { cache, filters, functions, globals, settings } = options || retrieveOptionsFromConfigFile()

  configureTwig({ cache, filters, functions })

  return {
    name: 'vite-plugin-twig',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => parseHTML(html, { globals, settings })
    },
    handleHotUpdate({ file, server }) {
      if (path.extname(file) === '.twig') {
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}
