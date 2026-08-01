import { TenderParticipantQuickActionDialog } from "@/components/dialogs/tender-details-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { queryTenderDetailsCommand } from "@/utils/tender-utils";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "lucide-react";

export const Route = createFileRoute("/(dashboard)/tenders/tender-details/$id")(
  {
    loader: async ({ params }) => {
      const tenderId = params.id;

      const res = await queryTenderDetailsCommand(tenderId);

      return { res };
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  const {
    res: { error, success },
  } = Route.useLoaderData();

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-8">
      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive font-medium">
          {error.error_message}
        </div>
      )}

      {success && (
        <>
          {/* Header & Overview Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold">
                {success.data?.tender.jail}
              </CardTitle>
              <CardDescription>
                Tender ID: {success.data?.tender.tender.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Tender Number
                  </span>
                  <p className="font-medium">
                    {success.data?.tender.tender.tender_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Notice Number
                  </span>
                  <p className="font-medium">
                    {success.data?.tender.tender.notice_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Estimated Amount
                  </span>
                  <p className="font-medium">
                    {success.data?.tender.tender.estimated_amount} TK
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Total Bids
                  </span>
                  <p className="font-medium">
                    {success.data?.participants.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Bids Section Header */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Participant Bids
            </h2>

            {/* Bids Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {success.data?.participants.map((participant, index) => (
                <Card
                  key={participant.tender_participant.id ?? index}
                  className="flex flex-col justify-between"
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      {participant.organization}
                    </CardTitle>
                    <CardDescription>
                      Proprietor: {participant.proprietor}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bid Amount</span>
                      <span className="font-semibold">
                        {participant.tender_participant.quoted_amount} TK
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pay Order</span>
                      <span className="font-medium">
                        {participant.pay_order_number}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge>
                        {participant.pay_order_is_released
                          ? "Released"
                          : "Pending"}
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <TenderParticipantQuickActionDialog
                      btnText="Quick Action"
                      tenderParticipantId={participant.tender_participant.id}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
