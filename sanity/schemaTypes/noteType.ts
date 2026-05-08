import {defineField, defineType} from 'sanity'

export const noteType = defineType({
  name: 'note',
  title: 'Notes',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'UX', value: 'ux'},
          {title: 'Dev', value: 'dev'},
          {title: 'Release', value: 'release'},
        ],
      },
    }),
  ],
})
