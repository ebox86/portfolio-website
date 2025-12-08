import {HomeIcon, DocumentTextIcon, DocumentIcon, ComposeIcon, TagIcon, UserIcon, CaseIcon} from '@sanity/icons'

export default (S) =>
  S.list()
    .title('Content')
    .items([
      // Home + legal at the top
      S.listItem()
        .title('Home & Legal')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Home & Legal')
            .items([
              S.listItem()
                .title('Home Settings')
                .icon(HomeIcon)
                .child(S.document().title('Home Settings').schemaType('homeSettings').documentId('homeSettings')),
              S.divider(),
              S.listItem()
                .title('Privacy Policy')
                .icon(DocumentIcon)
                .child(S.document().title('Privacy Policy').schemaType('legalPage').documentId('privacy')),
              S.listItem()
                .title('Terms of Service')
                .icon(DocumentTextIcon)
                .child(S.document().title('Terms of Service').schemaType('legalPage').documentId('terms')),
            ])
        ),

      // About group
      S.listItem()
        .title('About')
        .icon(UserIcon)
        .child(
          S.list()
            .title('About')
            .items([
              S.listItem()
                .title('About Settings')
                .icon(DocumentIcon)
                .child(S.document().title('About Settings').schemaType('aboutSettings').documentId('aboutSettings')),
              S.divider(),
              S.listItem()
                .title('Professional Experience')
                .child(S.documentTypeList('professionalExperience').title('Professional Experience')),
              S.divider(),
              S.listItem().title('Education').child(S.documentTypeList('education').title('Education')),
              S.divider(),
              S.listItem()
                .title('Personal Activities')
                .icon(DocumentIcon)
                .child(S.document().title('Personal Activities').schemaType('personalActivity').documentId('personalActivity')),
            ])
        ),

      // Blog (posts) with categories nested
      S.listItem()
        .title('Blog')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('All Posts')
                .schemaType('post')
                .child(S.documentTypeList('post').title('All Posts')),
              S.divider(),
              S.listItem()
                .title('Post Categories')
                .icon(TagIcon)
                .child(S.documentTypeList('postCategory').title('Post Categories')),
              S.listItem()
                .title('Post Tags')
                .icon(TagIcon)
                .child(S.documentTypeList('postTag').title('Post Tags')),
            ])
        ),

      // Projects with categories nested
      S.listItem()
        .title('Projects')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('All Projects')
                .icon(CaseIcon)
                .schemaType('project')
                .child(S.documentTypeList('project').title('All Projects')),
              S.divider(),
              S.listItem()
                .title('Project Categories')
                .icon(TagIcon)
                .child(S.documentTypeList('projectCategory').title('Project Categories')),
            ])
        ),

      // Contact settings
      S.listItem()
        .title('Contact')
        .icon(ComposeIcon)
        .child(
          S.document()
            .title('Contact Settings')
            .schemaType('contactSettings')
            .documentId('contactSettings')
        ),

      S.divider(),

      // Regular author doc list, if needed
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),
    ])
