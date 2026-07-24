import { columns } from "@/components/data-tables/jails/columns";
import { DataTable } from "@/components/data-tables/jails/data-table";
import { getAllJailCommand } from "@/utils/jail-utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

// query jails
const jailsQuery = queryOptions({
  queryKey: ["jails"],
  queryFn: () => getAllJailCommand(),
});

export const Route = createFileRoute("/(dashboard)/jail/view-all-jails")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(jailsQuery);
  },
  pendingComponent: () => {
    return <div>Loading Jail Table.....</div>;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(jailsQuery);
  return (
    <div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data.success?.data?.jails!} />
      </div>
    </div>
  );
}
