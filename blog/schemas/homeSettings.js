export default {
  name: 'homeSettings',
  title: 'Home Settings',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main H1 on the homepage (e.g., "👋 Hey, I’m Evan").',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Short subtext under the H1.',
    },
    {
      name: 'pronouns',
      title: 'Pronouns',
      type: 'string',
      description: 'Displayed on the home hero (e.g., He/him).',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City/region to show on the home hero.',
    },
    {
      name: 'headshot',
      title: 'Headshot',
      type: 'image',
      description: 'Headshot shown on the homepage.',
      options: { hotspot: true },
    },
  ],
}
