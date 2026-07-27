import { queryTenderListCommand } from "@/utils/tender-utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/tenders/view-tenders")({
  loader: async ({}) => {
    const res = await queryTenderListCommand();

    return {
      tenders: res.success?.data?.tenders,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { tenders } = Route.useLoaderData();
  return (
    <div>
      {tenders?.map((tender, index) => (
        <Link
          to="/tenders/tender-details/$id"
          params={{
            id: tender.id,
          }}
          key={tender.id || index}
        >
          {tender.jail_id}
        </Link>
      ))}
    </div>
  );
}
