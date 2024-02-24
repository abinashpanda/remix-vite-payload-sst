import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { viteBundler } from '@payloadcms/bundler-vite'
import { buildConfig } from 'payload/config'
import path from 'path'
import Users from './cms/collections/Users'
import invariant from 'tiny-invariant'

invariant(process.env.DATABASE_URL, 'DATABASE_URL is required')

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    vite: (incomingViteConfig) => ({
      ...incomingViteConfig,
      build: {
        ...incomingViteConfig.build,
        outDir: path.resolve(__dirname, 'build/payload'),
      },
    }),
  },
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.DATABASE_URL,
  }),
  collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'cms/payload-types.ts'),
  },
})
