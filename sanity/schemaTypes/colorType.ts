import {defineField, defineType} from 'sanity'

export const colorType = defineType({
  name: 'color',
  title: 'Colors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tokenKey',
      title: 'Token key',
      type: 'string',
    }),
    defineField({
      name: 'hex',
      title: 'HEX',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
    }),
  ],
})
