import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenderParticipantDetails } from "@/utils/tender-participant-utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

// query tender participant details
const tenderParticipantQuery = (id: string) =>
  queryOptions({
    queryKey: ["tender-participant", id],
    queryFn: () => getTenderParticipantDetails(id),
  });

export const Route = createFileRoute(
  "/(dashboard)/tender-participant/participant/$id",
)({
  loader: async ({ params, context }) => {
    const tenderParticipantId = params.id;

    context.queryClient.ensureQueryData(
      tenderParticipantQuery(tenderParticipantId),
    );
  },
  pendingComponent: () => {
    return <div>Loading Tender Participant Details.....</div>;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id: tenderParticipantId } = Route.useParams();

  const {
    data: { success, error: participantError },
    error,
  } = useSuspenseQuery(tenderParticipantQuery(tenderParticipantId));

  // winner status
  const isWinner =
    success?.data?.tender_participant.id ===
    success?.data?.tender.winner_participant_id;

  // track the error
  useEffect(() => {
    // show error in toast if exist
    if (participantError || error) {
      toast.error(participantError?.error_message ?? error?.message);
    }
  }, [participantError, error]);

  return (
    <div className="space-y-6 mx-auto p-4">
      {/* Error Alert */}
      {(error || participantError) && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive font-medium">
            {error?.message ?? participantError?.error_message}
          </CardContent>
        </Card>
      )}

      {success?.data && (
        <div className="space-y-6">
          {/* PRIMARY FOCUS: Participant Card */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Participant Details</CardTitle>
                {isWinner && <Badge>Winner</Badge>}
              </div>
              <Button variant={isWinner ? "outline" : "default"}>
                {isWinner ? "Discard Winner" : "Assign Winner"}
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Quoted Amount</p>
                  <p className="text-2xl font-semibold">
                    {success.data.tender_participant.quoted_amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remarks</p>
                  <p className="text-sm">
                    {success.data.tender_participant.remarks || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted By</p>
                  <p className="text-sm">
                    {success.data.tender_participant.created_by}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Submission Date
                  </p>
                  <p className="text-sm">
                    {success.data.tender_participant.created_at}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECONDARY FOCUS: Supporting Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tender Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Tender Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Tender #:</span>{" "}
                  {success.data.tender.tender_number}
                </p>
                <p>
                  <span className="text-muted-foreground">Notice #:</span>{" "}
                  {success.data.tender.notice_number}
                </p>
                <p>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  <Link
                    to="/tenders/tender-details/$id"
                    params={{ id: success.data.tender.id! }}
                    className="underline"
                  >
                    {success.data.tender.id}
                  </Link>
                </p>
                <p>
                  <span className="text-muted-foreground">Created:</span>{" "}
                  {success.data.tender.created_at}
                </p>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{success.data.organization.name}</p>
                <p>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  {success.data.organization.id}
                </p>
                <p>
                  <span className="text-muted-foreground">Proprietor:</span>{" "}
                  {success.data.organization.proprietor_name}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {success.data.organization.phone_number}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {success.data.organization.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {success.data.organization.address}
                </p>
              </CardContent>
            </Card>

            {/* Jail Facility Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Jail Facility
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{success.data.jail.name}</p>
                <p>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  {success.data.jail.id}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {success.data.jail.phone_number}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {success.data.jail.address}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
