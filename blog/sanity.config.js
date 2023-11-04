// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import schema from './schemas/schema'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { codeInput } from '@sanity/code-input'
import { openaiImageAsset } from 'sanity-plugin-asset-source-openai'
import keys from './env.local.json'

export default defineConfig({
  name: 'default',
  title: 'Portfolio Website',
  projectId: 'bbav55bn',
  dataset: 'production',
  plugins: [
    deskTool(),
    unsplashImageAsset(),
    codeInput(),
    openaiImageAsset({
      API_KEY: keys.SANITY_STUDIO_OPENAI_API_KEY
    })
  ],
  schema: {
    types: schema,
  },
})