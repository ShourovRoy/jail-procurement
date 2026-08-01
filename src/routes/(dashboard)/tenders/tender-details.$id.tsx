import { queryTenderDetailsCommand } from "@/utils/tender-utils";
import { createFileRoute } from "@tanstack/react-router";

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
    <div>
      {error && <div className="text-red-500">{error.error_message}</div>}

      {success && (
        <>
          <div className="text-lg font-bold">Tender Details</div>
          <p>Tender number: {success.data?.tender.tender.tender_number}</p>
          <p>Tender number: {success.data?.tender.jail}</p>

          <div>
            <h1>Bids</h1>

            {success.data?.participants.map((participant, index) => (
              <div key={participant.tender_participant.id}>
                <p>Bidder: {participant.organization}</p>
                <p>
                  Bid Amount: {participant.tender_participant.quoted_amount}
                </p>
                <p>Bid Status: {participant.tender_participant.created_at}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
