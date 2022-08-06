import path from 'node:path'
import process from 'node:process'
import Twig from 'twig'
import type { IndexHtmlTransformContext } from 'vite'
import type { PluginOptions, TwigFragment, TwigFragmentFilter } from '../types'

const cwd = process.cwd()

function warn(message: string) {
  console.log('\x1b[31m%s\x1b[0m', message)
}

export async function retrieveConfigFromFile(): Promise<PluginOptions|undefined> {
  try {
    const { default: config } = await import(`${cwd}/twig.config`)
    return config
  } catch {
    return
  }
}

export function configureTwig({ cache, extensions }: PluginOptions = {}) {
  Twig.cache(cache || false)

  if (extensions?.filters) {
    Object
      .entries(extensions.filters)
      .forEach(([key, fn]) => Twig.extendFilter(key, fn))
  }

  if (extensions?.functions) {
    Object
      .entries(extensions.functions)
      .forEach(([key, fn]) => Twig.extendFunction(key, fn))
  }
}

export async function parseHTML(html: string, ctx: IndexHtmlTransformContext, { fileFilter, fragmentFilter, globals, settings }: PluginOptions = {}) {  
  const filename = ctx.path.replace(/^\/?/, '')

  if (typeof fileFilter === 'function' && !fileFilter(filename)) return html

  const placeholders = retrieveTemplatePlaceholders(html, fragmentFilter)
  
  if (!placeholders.length) return html

  const contents = await Promise.allSettled(placeholders.map(({ template, data }) => {
    const filepath = path.join(cwd, settings?.views || '', template)
    const context = { ...data, ...globals, settings: settings }
    return renderTwigTemplate(filepath, context)
  }))

  return contents.reduce((output, res, i) => {
    if (res.status === 'fulfilled') {
      output = output.replace(placeholders[i].placeholder, res.value)
    } else {
      warn(res.reason.message)
    }
    return output
  }, html)
}

export function retrieveTemplatePlaceholders(html: string, fragmentFilter?: TwigFragmentFilter): TwigFragment[] {
  const matches = html.matchAll(/<script\b[^>]*data-template="(?<template>[^>]+)"[^>]*>(?<data>[\s\S]+?)<\/script>/gmi)
  let fragments: TwigFragment[] = []

  try {
    [...matches].forEach(({ [0]: placeholder, groups = {} }) => {
      const data = JSON.parse(groups.data)

      if (typeof fragmentFilter !== 'function' || fragmentFilter(placeholder, groups.template, data)) {
        fragments.push({
          data,
          placeholder,
          template: groups.template
        })
      }
    })
  } catch (error) {
    error instanceof Error && warn(error.message)
  }

  return fragments
}

export async function renderTwigTemplate(filepath: string, context: object): Promise<string> {
  return new Promise((resolve, reject) => {
    Twig.renderFile(filepath, context, (err, html) => {
      if (err) {
        reject(err)
      } else {
        resolve(html)
      }
    })
  })
}
