'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

const canManageComponents = (
  currentUser: {roles?: Array<{name?: string}>} | null | undefined,
) =>
  Boolean(
    currentUser?.roles?.some(
      (role) => role.name === 'developer' || role.name === 'administrator',
    ),
  )

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'component') return prev
      if (canManageComponents(context.currentUser)) return prev

      // Keep only non-mutating actions for non-developers on components.
      return prev.filter((action) => {
        const actionName =
          typeof action === 'function' && 'action' in action
            ? (action as {action?: string}).action
            : undefined

        return actionName === 'history' || actionName === 'inspect'
      })
    },
    newDocumentOptions: (prev, context) => {
      if (canManageComponents(context.currentUser)) return prev

      return prev.filter(
        (templateItem) => templateItem.templateId !== 'component',
      )
    },
  },
  vite: (viteConfig: any) => ({
    ...viteConfig,
    server: {
      ...viteConfig.server,
      watch: {
        ...viteConfig.server?.watch,
        ignored: ['**/.next/**', '**/node_modules/**'],
      },
    },
  }),
})
