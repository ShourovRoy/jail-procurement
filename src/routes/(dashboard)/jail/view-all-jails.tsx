import { columns } from "@/components/data-tables/jails/columns";
import { DataTable } from "@/components/data-tables/jails/data-table";
import { getAllJailCommand } from "@/utils/jail-utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/jail/view-all-jails")({
  loader: async () => {
    const res = await getAllJailCommand();

    return {
      jails: res.success?.data?.jails!,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { jails } = Route.useLoaderData();
  return (
    <div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={jails} />
      </div>
    </div>
  );
}
