import {defineField, defineType} from 'sanity'

const canEditComponents = (currentUser: {roles?: Array<{name?: string}>} | null | undefined) =>
  Boolean(
    currentUser?.roles?.some(
      (role) => role.name === 'developer' || role.name === 'administrator',
    ),
  )

export const componentType = defineType({
  name: 'component',
  title: 'Components',
  type: 'document',
  readOnly: ({currentUser}) => !canEditComponents(currentUser),
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'figmaUrl',
      title: 'Figma URL',
      type: 'url',
    }),
    defineField({
      name: 'storybookUrl',
      title: 'Storybook URL',
      type: 'url',
    }),
    defineField({
      name: 'docsUrl',
      title: 'Docs URL',
      type: 'url',
    }),
  ],
})
