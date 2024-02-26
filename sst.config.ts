import { Service } from 'sst/constructs'
import { SSTConfig } from 'sst'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()
const { DATABASE_URL, PAYLOAD_SECRET } = z
  .object({
    DATABASE_URL: z.string(),
    PAYLOAD_SECRET: z.string(),
  })
  .parse(process.env)

export default {
  config: () => ({
    name: 'remix-sst',
    region: 'ap-south-1',
  }),
  stacks: (app) => {
    app.stack(({ stack }) => {
      const site = new Service(stack, 'RemixSite', {
        port: 3000,
        environment: {
          DATABASE_URL,
          PAYLOAD_SECRET,
        },
      })

      stack.addOutputs({
        SiteURL: site.url,
      })
    })
  },
} satisfies SSTConfig
