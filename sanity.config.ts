import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineLocations, defineDocuments} from 'sanity/presentation'
import {colorInput} from '@sanity/color-input'
import {simplerColorInput} from 'sanity-plugin-simpler-color-input'
import {media} from 'sanity-plugin-media'
import {table} from '@sanity/table'
import {markdownSchema} from 'sanity-plugin-markdown'
import {schemaTypes} from './sanity/schemaTypes'
import {brandColors} from './sanity/lib/brandColors'

export default defineConfig({
  name: 'default',
  title: 'Our City Action Buffalo',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mttfjag0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/admin',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin,
        draftMode: {
          enable: '/api/draft',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "page" && slug.current == "home"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug`,
          },
        ]),
        locations: {
          page: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: doc?.slug === 'home' ? '/' : `/${doc?.slug}`,
                },
              ],
            }),
          }),
        },
      },
    }),
    visionTool(),
    colorInput(),
    simplerColorInput({
      defaultColorList: brandColors.map(color => ({label: color.title, value: color.hex})),
      defaultColorFormat: 'hex',
      enableSearch: true,
    }),
    media(),
    table(),
    markdownSchema(),
  ],

  schema: {
    types: schemaTypes,
  },
})
