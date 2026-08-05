// release performance security sheet
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
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { releasePerformanceSecurityUtilCommand } from "@/utils/performance-security-utils";
import { useState } from "react";

export function ReleasePerformanceSecuritySheet({
  tender_participant_id,
  performance_security_id,
  queryClient,
}: {
  tender_participant_id: string | null | undefined;
  performance_security_id: string | null | undefined;
  queryClient: QueryClient;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const releasePerformanceSecurityForm = useForm({
    defaultValues: {
      tender_participant_id: tender_participant_id ?? "",
      performance_security_id: performance_security_id ?? "",
      released_date: "",
    },
    onSubmit: async ({ value }) => {
      const res = await releasePerformanceSecurityUtilCommand({
        participant_id: value.tender_participant_id,
        performance_security_id: value.performance_security_id,
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

        // close the sheet
        setOpen(false);
      }
    },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Release Performance Security
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

              await releasePerformanceSecurityForm.handleSubmit();
            }}
          >
            <SheetHeader>
              <SheetTitle>Performance Security Release Confirmation</SheetTitle>
              <SheetDescription>
                Selecting the date will help to keep the track of release.
              </SheetDescription>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <div className="py-3">
                <releasePerformanceSecurityForm.Field
                  name="released_date"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Release date is required!" : undefined,
                  }}
                  children={(field) => (
                    <DatePickerField
                      field={field}
                      label="Performance Security Issue Date"
                    />
                  )}
                />
              </div>
            </div>
            <SheetFooter>
              <releasePerformanceSecurityForm.Subscribe
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
