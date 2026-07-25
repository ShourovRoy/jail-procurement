import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/tenders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(dashboard)/tenders/"!</div>;
}
