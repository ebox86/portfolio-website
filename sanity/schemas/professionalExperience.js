export default {
  name: 'professionalExperience',
  title: 'Professional Experience',
  type: 'document',
  fields: [
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'roleTitle',
      title: 'Role Title',
      type: 'string',
    },
    {
      name: 'startYear',
      title: 'Start Year',
      type: 'number',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'endYear',
      title: 'End Year',
      type: 'number',
      description: 'Leave blank if current.',
    },
    {
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'mode',
      title: 'Work Mode',
      type: 'string',
      options: {
        list: [
          { title: 'On-site', value: 'on-site' },
          { title: 'Remote', value: 'remote' },
          { title: 'Hybrid', value: 'hybrid' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Use to sort experiences.',
    },
  ],
}
