export default {
  name: 'aboutSettings',
  title: 'About Settings',
  type: 'document',
  fields: [
    {
      name: 'introHeading',
      title: 'Intro Heading',
      type: 'string',
      description: 'Top-level heading for the About page.',
    },
    {
      name: 'introSubheading',
      title: 'Intro Subheading',
      type: 'string',
      description: 'Short subtext under the heading.',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'blockContent',
      description: 'Optional rich intro/bio content.',
    },
    {
      name: 'resume',
      title: 'Resume File',
      type: 'file',
      description: 'Upload your latest resume to power the download button.',
    },
    {
      name: 'headerImage',
      title: 'Header Image',
      type: 'image',
      description: 'Portrait or photo used in the Me page header (clipped with the polygon mask).',
      options: {
        hotspot: true,
      },
    },
  ],
}
