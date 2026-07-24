import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/jail/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h3>Jail Default Page</h3>
    </div>
  );
}
