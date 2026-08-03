import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "@tanstack/react-form";
import { DatePickerField } from "../dates/date-input-field";
import { Spinner } from "../ui/spinner";
import { releasePayorderUtilCommand } from "@/utils/pay-order-utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function ReleasePayorderSheet({
  tender_participant_id,
  pay_order_id,
}: {
  tender_participant_id: string | null | undefined;
  pay_order_id: string | null | undefined;
}) {
  const queryClient = useQueryClient();

  const releasePaymentForm = useForm({
    defaultValues: {
      tender_participant_id: tender_participant_id ?? "",
      pay_order_id: pay_order_id ?? "",
      released_date: "",
    },
    onSubmit: async ({ value }) => {
      const res = await releasePayorderUtilCommand({
        participant_id: value.tender_participant_id,
        pay_order_id: value.pay_order_id,
        released_date: value.released_date,
      });

      // handle error
      if (res?.error) {
        toast.error(res.error.error_message);
      }

      // handle success
      if (res?.success?.message) {
        // show toast
        toast.success(res?.success?.message);

        // invalidate tender participant query cache and refetch
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["tender-participant", value.tender_participant_id],
          }),
          queryClient.refetchQueries({
            queryKey: ["tender-participant", value.tender_participant_id],
          }),
        ]);
      }
    },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Release Payorder
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <form
            onSubmit={async (e) => {
              e.stopPropagation();
              e.preventDefault();

              await releasePaymentForm.handleSubmit();
            }}
          >
            <SheetHeader>
              <SheetTitle>Pay Order Release Confirmation</SheetTitle>
              <SheetDescription>
                Selecting the date will help to keep the track of release.
              </SheetDescription>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <div className="py-3">
                <releasePaymentForm.Field
                  name="released_date"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Issue date is required!" : undefined,
                  }}
                  children={(field) => (
                    <DatePickerField
                      field={field}
                      label="Pay-Order Issue Date"
                    />
                  )}
                />
              </div>
            </div>
            <SheetFooter>
              <releasePaymentForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Release Payorder"}
                  </Button>
                )}
              />
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
