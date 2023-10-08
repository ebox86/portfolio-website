export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.max(16)
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
}
