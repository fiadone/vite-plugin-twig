import type { RenderOptions } from 'twig'

export interface TwigExtensions {
  [name: string]: (...args: any[]) => any
}

export interface TwigOptions {
  cache?: boolean,
  filters?: TwigExtensions,
  functions?: TwigExtensions,
  globals?: { [key: string]: any }
  settings?: RenderOptions
}

export interface TwigFragment {
  placeholder: string,
  template: string,
  data?: object
}
