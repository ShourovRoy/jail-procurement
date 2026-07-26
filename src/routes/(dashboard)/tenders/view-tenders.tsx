import { queryTenderListCommand } from "@/utils/tender-utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/tenders/view-tenders")({
  loader: async ({}) => {
    await queryTenderListCommand();

    return {
      tenders: [],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { tenders } = Route.useLoaderData();
  return (
    <div>
      <Link
        to="/tenders/tender-details/$id"
        params={{
          id: "1",
        }}
      >
        View Tender Details
      </Link>
    </div>
  );
}
