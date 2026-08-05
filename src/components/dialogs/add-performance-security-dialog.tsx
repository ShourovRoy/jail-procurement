import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { InputFieldError } from "../error-fields/input-error-field";
import { DatePickerField } from "../dates/date-input-field";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import { addPerformanceSecurityUtilCommand } from "@/utils/performance-security-utils";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AddPerformanceSecurityDialog({
  tender_id,
  organization_id,
  participant_id,
  queryClient,
}: {
  tender_id: string;
  organization_id: string;
  participant_id: string;
  queryClient: QueryClient;
}) {
  const [open, setOpen] = useState<boolean>(false);
  // performance security form
  const performanceSecurityForm = useForm({
    defaultValues: {
      tender_id: tender_id,
      organization_id: organization_id,
      participant_id: participant_id,
      performance_security_number: "",
      amount: "",
      issue_date: "",
      expiry_date: "",
      remarks: "",
    },
    onSubmit: async ({ value, formApi }) => {
      // execute the add performance security until command
      const res = await addPerformanceSecurityUtilCommand({
        tender_id: value.tender_id,
        participant_id: value.participant_id,
        organization_id: value.organization_id,
        performance_security_number: value.performance_security_number,
        amount: Number(value.amount),
        issue_date: value.issue_date,
        expiry_date: value.expiry_date,
        remarks: value.remarks,
      });

      //   handle error
      if (res?.error) {
        toast.error(res.error.error_message);
      }

      //   handle success
      if (res?.success?.message) {
        // show success toast message
        toast.success(res.success.message);

        // reset the form
        formApi.reset();

        // invalidate tender participant query cache and refetch
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["tender-participant", participant_id],
          }),
          queryClient.refetchQueries({
            queryKey: ["tender-participant", participant_id],
          }),
        ]);

        setOpen(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Attach Performance Security
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();

            await performanceSecurityForm.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Performance Security</DialogTitle>
            <DialogDescription>
              Fill the details to add performance security.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {/* performance security number */}
            <performanceSecurityForm.Field
              name="performance_security_number"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Performance seuciry number is required!";
                  }

                  if (value.length < 5) {
                    return "Invalid performance security number!";
                  }
                },
              }}
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Performance Security Number
                    </FieldLabel>

                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="PS-JSDNKSJRNKGJRG"
                    />
                    <InputFieldError field={field} />
                  </Field>
                );
              }}
            />

            <performanceSecurityForm.Field
              name="amount"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Performance security amount is required!";
                  }

                  if (value && Number(value) <= 0.01) {
                    return "Min 0.01!";
                  }
                },
              }}
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Amount/Value</FieldLabel>

                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                    <InputFieldError field={field} />
                  </Field>
                );
              }}
            />

            {/* issue and expiry date */}
            {/* issue date */}
            <performanceSecurityForm.Field
              name="issue_date"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Issue date is required!" : undefined,
              }}
              children={(field) => (
                <DatePickerField
                  field={field}
                  label="Performance security Issue Date"
                />
              )}
            />

            {/* pay order expire date */}
            <performanceSecurityForm.Field
              name="expiry_date"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Expire date is required!" : undefined,
              }}
              children={(field) => (
                <DatePickerField
                  field={field}
                  label="Performance security Expire Date"
                />
              )}
            />

            {/* remarks */}
            <performanceSecurityForm.Field
              name="remarks"
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Remarks</FieldLabel>

                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      placeholder="Notes..."
                    />
                    <InputFieldError field={field} />
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <performanceSecurityForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? <Spinner /> : "Add now"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
