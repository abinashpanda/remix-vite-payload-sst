import { RemixSite } from 'sst/constructs'
import { SSTConfig } from 'sst'

export default {
  config: () => ({
    name: 'remix-sst',
    region: 'ap-south-1',
  }),
  stacks: (app) => {
    app.stack(({ stack }) => {
      const site = new RemixSite(stack, 'RemixSite', {
        // TODO: This is just for test
        buildCommand: 'pnpm build:dummy',
      })

      stack.addOutputs({
        SiteURL: site.url,
      })
    })
  },
} satisfies SSTConfig
