import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/tenders/tender-details/$id")(
  {
    loader: ({ params }) => {
      const tenderId = params.id;
      return {
        tenderId,
      };
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { tenderId } = Route.useLoaderData();

  return <div>Hello "/(dashboard)/tenders/tenders/$id"! = {tenderId}</div>;
}
