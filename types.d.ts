export interface PluginOptions {
  cache?: boolean
  extensions?: {
    filters?: TwigExtensions
    functions?: TwigExtensions
  }
  fileFilter?: (filename: string) => boolean
  fragmentFilter?: TwigFragmentFilter
  globals?: { [key: string]: any }
  settings?: {
    views: any
    'twig options': any
  }
}

export interface TwigExtensions {
  [name: string]: (...args: any[]) => any
}

export interface TwigFragment {
  placeholder: string
  template: string
  data?: object
}

export type TwigFragmentFilter = (script: string, template: string, data: object) => boolean
