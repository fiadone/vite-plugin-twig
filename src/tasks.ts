import process from 'process'
import path from 'path'
import Twig, { RenderOptions } from 'twig'
import type { TwigOptions, TwigFragment } from '../types'

const cwd = process.cwd()

function warn(message: string) {
  console.log('\x1b[31m%s\x1b[0m', message)
}

export function retrieveOptionsFromConfigFile(filename: string = 'twig.config.js'): TwigOptions {
  try {
    const config = path.resolve(cwd, filename)
    return require(config)
  } catch {
    return {}
  }
}

export function configureTwig(options: TwigOptions = {}) {
  Twig.cache(options.cache || false)

  if (options.filters) {
    Object
      .entries(options.filters)
      .forEach(([key, fn]) => Twig.extendFilter(key, fn))
  }

  if (options.functions) {
    Object
      .entries(options.functions)
      .forEach(([key, fn]) => Twig.extendFunction(key, fn))
  }
}

export async function parseHTML(html: string, options: TwigOptions) {
  let output = html
  const placeholders = retrieveTemplatePlaceholders(html)

  if (placeholders.length) {
    const contents = await Promise.allSettled(
      placeholders.map(({ template, data }) => {
        const context = { ...options.globals, ...data, ...options.settings }
        return renderTwigTemplate(template, context)
      })
    )

    contents.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        output = output.replace(placeholders[i].placeholder, res.value)
      } else {
        warn(res.reason.message)
      }
    })
  }

  return output
}

export function retrieveTemplatePlaceholders(html: string): TwigFragment[] {
  const matches = html.matchAll(/<script\b[^>]*data-template="(?<template>[^>]+)"[^>]*>(?<data>[\s\S]+?)<\/script>/gmi)

  try {
    return [...matches].map(({ [0]: placeholder, groups = {} }) => ({
      placeholder,
      template: groups.template,
      data: JSON.parse(groups.data)
    }))
  } catch (error) {
    error instanceof Error && warn(error.message)
    return []
  }
}

export async function renderTwigTemplate(template: string, context: RenderOptions): Promise<string> {
  const filepath = path.join(cwd, context.views || '', template)

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
