import path from 'node:path'
import type { Plugin } from 'vite'
import type { PluginOptions } from '../types'
import { configureTwig, parseHTML, retrieveConfigFromFile } from './tasks'

export async function viteTwigPlugin(options: PluginOptions): Promise<Plugin> {

  const config = options || await retrieveConfigFromFile()

  configureTwig(config)

  return {
    name: 'vite-plugin-twig',
    transformIndexHtml: {
      enforce: 'pre',
      transform: async (html, ctx) => {
        return await parseHTML(html, ctx, config)
      }
    },
    handleHotUpdate({ file, server }) {
      if (path.extname(file) === '.twig') {
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}
