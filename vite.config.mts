import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import config from './remix.config'

export default defineConfig({
  plugins: [remix(config), tsconfigPaths()],
})
