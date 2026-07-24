import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/')({
  component: Index,
})

function Index() {

  const { authSession } = Route.useRouteContext()

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      auth: {authSession ? 'auth' : 'not auth'}
    </div>
  )
}
