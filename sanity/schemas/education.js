export default {
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    {
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'degree',
      title: 'Degree',
      type: 'string',
    },
    {
      name: 'field',
      title: 'Field of Study',
      type: 'string',
    },
    {
      name: 'startYear',
      title: 'Start Year',
      type: 'number',
    },
    {
      name: 'endYear',
      title: 'End Year',
      type: 'number',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Use to sort education entries.',
    },
  ],
}
