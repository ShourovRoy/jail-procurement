import { tenderColumns } from "@/components/data-tables/tenders/tender-columns";
import { TenderDataTable } from "@/components/data-tables/tenders/tender-data-table";
import { queryTenderListCommand } from "@/utils/tender-utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

// query jails
const tendersQuery = queryOptions({
  queryKey: ["tenders"],
  queryFn: () => queryTenderListCommand(),
});

export const Route = createFileRoute("/(dashboard)/tenders/view-tenders")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(tendersQuery);
  },
  pendingComponent: () => <p>Loading Tenders....</p>,
  component: RouteComponent,
});

function RouteComponent() {
  // getting tenders from cache
  const { data, error } = useSuspenseQuery(tendersQuery);

  // track and show error message if available
  useEffect(() => {
    // checking if error
    if (error?.message) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div>
      <TenderDataTable
        columns={tenderColumns}
        data={data.success?.data?.tenders!}
      />
    </div>
  );
}
