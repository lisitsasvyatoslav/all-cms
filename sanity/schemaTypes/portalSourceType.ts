import {defineField, defineType} from 'sanity'

export const portalSourceType = defineType({
  name: 'portalSource',
  title: 'Portal Sources',
  type: 'document',
  fields: [
    defineField({
      name: 'figmaLibraryUrl',
      title: 'Figma library URL',
      type: 'url',
    }),
    defineField({
      name: 'storybookUrl',
      title: 'Storybook URL',
      type: 'url',
    }),
    defineField({
      name: 'documentationUrl',
      title: 'Documentation URL',
      type: 'url',
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'Repository URL',
      type: 'url',
    }),
  ],
})
