import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTenderParticipantDetails } from "@/utils/tender-participant-utils";
import { useQuery } from "@tanstack/react-query";

export function TenderParticipantQuickActionDialog({
  btnText,
  tenderParticipantId,
}: {
  btnText: string;
  tenderParticipantId: string;
}) {
  const { isLoading, error } = useQuery({
    queryKey: ["tender-participant-details", tenderParticipantId],
    queryFn: () => getTenderParticipantDetails(tenderParticipantId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{btnText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit max-h-9/12">
        <DialogHeader>
          <DialogTitle>Tender Participant Quick Action</DialogTitle>
          <DialogDescription>
            Participant ID: {tenderParticipantId}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {isLoading && <p>Loading...</p>}

          {error && <p>Error: {error.message}</p>}
        </div>
        <DialogFooter>
          <Button variant="secondary">Assign Winner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
