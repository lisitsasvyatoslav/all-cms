import {defineField, defineType} from 'sanity'

export const iconType = defineType({
  name: 'icon',
  title: 'Icons',
  type: 'document',
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
      validation: (rule) => rule.regex(/^[a-z0-9-]+$/),
    }),
    defineField({
      name: 'preview',
      title: 'Preview',
      type: 'image',
      options: {hotspot: false},
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
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
  ],
})
