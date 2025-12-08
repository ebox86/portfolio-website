export default {
  name: 'personalActivity',
  title: 'Personal Activities',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'Optional short intro for the personal activities section.',
    },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              description: 'CSS object-position (e.g., "30% center").',
            },
            { name: 'order', title: 'Order', type: 'number' },
          ],
        },
      ],
    },
  ],
}
