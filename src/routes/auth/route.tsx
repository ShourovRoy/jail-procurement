import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  loader: ({ context }) => {
    // get auth session from context
    const session = context.authSession;

    // if session exist redirect to home page
    if (session) {
      throw redirect({
        to: "/",
        replace: true,
      })
    }

  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Outlet />
  </div>
}
