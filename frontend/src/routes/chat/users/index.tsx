import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chat/user/user"!</div>
}
