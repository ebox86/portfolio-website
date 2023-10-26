// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import schema from './schemas/schema'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { codeInput } from '@sanity/code-input'

export default defineConfig({
  name: 'default',
  title: 'Portfolio Website',
  projectId: 'bbav55bn',
  dataset: 'production',
  plugins: [
    deskTool(),
    unsplashImageAsset(),
    codeInput(),
  ],
  schema: {
    types: schema,
  },
})