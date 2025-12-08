import {EarthGlobeIcon, ArrowTopRightIcon, DownloadIcon, LinkIcon} from '@sanity/icons'

export default {
  name: 'contactSettings',
  title: 'Contact Settings',
  type: 'document',
  fields: [
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Short line under "Let’s Connect" on the contact page.',
    },
    {
      name: 'socialLinks',
      title: 'Links & Actions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Tooltip and accessibility label for the button.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Destination URL (ignored for share; optional for resume if file provided).',
            },
            {
              name: 'tooltip',
              title: 'Tooltip text',
              type: 'string',
              description: 'Optional tooltip text. If empty, no tooltip is shown.',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon key (e.g., linkedin, x, github, resume, share, mail, copy, link).',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'X / Twitter', value: 'x' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Resume', value: 'resume' },
                  { title: 'Share', value: 'share' },
                  { title: 'Link', value: 'link' },
                  { title: 'Clipboard', value: 'copy' },
                  { title: 'Mail', value: 'mail' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              initialValue: 'social',
              options: {
                list: [
                  { title: 'Social', value: 'social' },
                  { title: 'Resume Download', value: 'resume' },
                  { title: 'Share (mailto + copy link)', value: 'share' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'shareSubject',
              title: 'Share email subject',
              type: 'string',
              hidden: ({ parent }) => parent?.linkType !== 'share',
            },
            {
              name: 'shareBody',
              title: 'Share email body',
              type: 'text',
              rows: 3,
              hidden: ({ parent }) => parent?.linkType !== 'share',
            },
            {
              name: 'resumeFile',
              title: 'Resume file',
              type: 'file',
              options: { storeOriginalFilename: true },
              hidden: ({ parent }) => parent?.linkType !== 'resume',
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'linkType',
              iconKey: 'icon',
            },
            prepare(selection) {
              const { title, subtitle, iconKey } = selection;
              const key = (iconKey || '').toLowerCase();
              let media = LinkIcon;
              let formattedSubtitle = 'Link';
              if (subtitle === 'share' || key === 'share') {
                media = ArrowTopRightIcon;
                formattedSubtitle = 'Share options';
              } else if (subtitle === 'resume' || key === 'resume' || key === 'download') {
                media = DownloadIcon;
                formattedSubtitle = 'Resume download link';
              } else if (subtitle === 'social') {
                media = EarthGlobeIcon;
                formattedSubtitle = 'Social media link';
              }
              return {
                title: title || 'Link',
                subtitle: formattedSubtitle,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
  ],
}
