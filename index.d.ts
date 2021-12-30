import type { Plugin } from 'vite'

export interface Options {
  /**
   * default: {}
   */
  filters?: { [name: string]: (...args: any[]) => any },
  /**
   * default: {}
   */
  functions?: { [name: string]: (...args: any[]) => any },
  /**
   * default: {}
   */
  globals?: { [key: string]: any }
}

declare function viteTwigPlugin(options?: Options): Plugin

export default viteTwigPlugin
