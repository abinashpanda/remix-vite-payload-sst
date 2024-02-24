import { Service } from 'sst/constructs'
import { SSTConfig } from 'sst'

export default {
  config: () => ({
    name: 'remix-sst',
    region: 'ap-south-1',
  }),
  stacks: (app) => {
    app.stack(({ stack }) => {
      const service = new Service(stack, 'RemixService', {
        port: 3000,
        environment: {},
      })
      stack.addOutputs({
        SiteUrl: service.url,
      })
    })
  },
} satisfies SSTConfig
