import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-4xl font-medium">Welcome to Remix</h1>
      <ul>
        <a href="/admin" target="_blank">
          Admin Panel
        </a>
      </ul>
    </div>
  )
}
