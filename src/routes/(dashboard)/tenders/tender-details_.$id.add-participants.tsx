import { InputFieldError } from "@/components/error-fields/input-error-field";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { queryOrgListCommand } from "@/utils/org-utils";
import { useForm } from "@tanstack/react-form";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DatePickerField } from "@/components/dates/date-input-field";
import { useEffect } from "react";
import { toast } from "sonner";
import { addTenderParticipant } from "@/utils/tender-participant-utils";

// query orgs
const orgsQuery = queryOptions({
  queryKey: ["orgs"],
  queryFn: () => queryOrgListCommand(),
});

export const Route = createFileRoute(
  "/(dashboard)/tenders/tender-details_/$id/add-participants",
)({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(orgsQuery);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useSuspenseQuery(orgsQuery);

  const { id: tenderId } = Route.useParams();

  const tenderParticipantForm = useForm({
    defaultValues: {
      tender_id: tenderId,
      organization_id: "",
      organization_name: "",
      quoted_amount: "",
      bid_submission_date: "",
      remarks: "",
      // payorder related fields
      issuer_bank_name: "",
      issuer_bank_branch: "",
      pay_order_number: "",
      pay_order_expiry_date: "",
      pay_order_issue_date: "",
      pay_order_amount: "",
    },

    onSubmit: async ({ value, formApi }) => {
      // execute add tender participant util
      const res = await addTenderParticipant({
        tender_id: value.tender_id,
        organization_id: value.organization_id,
        quoted_amount: Number(value.quoted_amount),
        bid_submission_date: value.bid_submission_date,
        remarks: value.remarks,
        issuer_bank_name: value.issuer_bank_name,
        issuer_bank_branch: value.issuer_bank_branch,
        pay_order_number: value.pay_order_number,
        pay_order_expiry_date: value.pay_order_expiry_date,
        pay_order_issue_date: value.pay_order_issue_date,
        pay_order_amount: Number(value.pay_order_amount),
      });

      // handle error message
      if (res?.error) {
        // show error toast
        toast.error(res.error.error_message);
      }

      // handle success message
      if (res?.success?.message) {
        // show success toast
        toast.success(res.success.message);

        // reset the form
        formApi.reset();
      }
    },
  });

  // track error
  useEffect(() => {
    // check if error available
    if (error?.message) {
      // show error
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div>
      <div className="container mx-auto">
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();

            // call the form submit handler
            await tenderParticipantForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Participant with bids</CardTitle>
              <CardDescription>
                Add bids for the associated tender.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* organization field */}

              <tenderParticipantForm.Field
                name="organization_name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Organization is required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Select Organization
                      </FieldLabel>

                      <Combobox
                        items={data?.success?.data?.organizations ?? []}
                        defaultValue={null}
                        onValueChange={(val) => {
                          field.handleChange(val!);
                          if (!val) {
                            tenderParticipantForm.setFieldValue(
                              "organization_id",
                              "",
                            );
                          }
                        }}
                      >
                        <ComboboxInput
                          placeholder="Select an organization"
                          showClear
                        />
                        <ComboboxContent>
                          {isLoading ? (
                            <>Loading organizations...</>
                          ) : (
                            <>
                              <ComboboxEmpty>No items found.</ComboboxEmpty>
                              <ComboboxList>
                                {(item) => (
                                  <div key={item.organization.name}>
                                    <ComboboxItem
                                      onClick={() => {
                                        tenderParticipantForm.setFieldValue(
                                          "organization_id",
                                          item.organization.id,
                                        );
                                      }}
                                      key={item.organization.id}
                                      value={item.organization.name}
                                    >
                                      {item.organization.name}{" "}
                                      {item.organization.id}
                                    </ComboboxItem>
                                  </div>
                                )}
                              </ComboboxList>
                            </>
                          )}
                        </ComboboxContent>
                      </Combobox>

                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* hidden org id field */}
              <tenderParticipantForm.Field
                name="organization_id"
                children={(field) => (
                  <input
                    type="hidden"
                    className="border-4 border-blue-500"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />

              {/* pay order number */}
              <tenderParticipantForm.Field
                name="pay_order_number"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Payorder number is required!";
                    }

                    if (value.length < 5) {
                      return "Invalid payorder number!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Payorder Number
                      </FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="PO-JSDNKSJRNKGJRG"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              <div className="flex items-center justify-between space-x-3">
                {/* tender bid amount */}
                <tenderParticipantForm.Field
                  name="quoted_amount"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return "Bid amount is required!";
                      }

                      if (value && Number(value) <= 0.01) {
                        return "Invalid bid amount!";
                      }
                    },
                  }}
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Tender Bid Quote
                        </FieldLabel>

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

                {/* payorder amount /value */}
                <tenderParticipantForm.Field
                  name="pay_order_amount"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return "Payorder amount is required!";
                      }

                      if (value && Number(value) <= 0.01) {
                        return "Invalid Payorder Value!";
                      }
                    },
                  }}
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Pay-order Amount
                        </FieldLabel>

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
              </div>

              {/* issuer bank name and branch name */}
              <div className="flex items-center justify-between space-x-3">
                {/* bank name */}
                <tenderParticipantForm.Field
                  name="issuer_bank_name"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return "Issuer bank name is required!";
                      }

                      if (value.length < 2) {
                        return "Invalid bank name!";
                      }
                    },
                  }}
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Issuer Bank
                        </FieldLabel>

                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="text"
                          placeholder="Pubali Bank Plc"
                        />
                        <InputFieldError field={field} />
                      </Field>
                    );
                  }}
                />

                {/* issuer bank branch */}
                <tenderParticipantForm.Field
                  name="issuer_bank_branch"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return "Issuer bank branch is required!";
                      }

                      if (value.length < 2) {
                        return "Invalid bank branch!";
                      }
                    },
                  }}
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Issuer Bank Branch
                        </FieldLabel>

                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="text"
                          placeholder="Noapara Bazar Branch"
                        />
                        <InputFieldError field={field} />
                      </Field>
                    );
                  }}
                />
              </div>

              {/* payorder issue, expire date and bid submission date */}
              <div className="flex items-center justify-between space-x-3">
                {/* pay order issue date */}
                <tenderParticipantForm.Field
                  name="pay_order_issue_date"
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

                {/* pay order expire date */}
                <tenderParticipantForm.Field
                  name="pay_order_expiry_date"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Expire date is required!" : undefined,
                  }}
                  children={(field) => (
                    <DatePickerField
                      field={field}
                      label="Pay-Order Expire Date"
                    />
                  )}
                />

                {/* Bid submission date */}
                <tenderParticipantForm.Field
                  name="bid_submission_date"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Bid submission date is required!" : undefined,
                  }}
                  children={(field) => (
                    <DatePickerField
                      field={field}
                      label="Bid-submission Date"
                    />
                  )}
                />
              </div>

              {/* remarks */}
              <tenderParticipantForm.Field
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
                        placeholder="123 Main Street, City, State"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />
            </CardContent>
            <CardFooter>
              <tenderParticipantForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Add Participant or Bidder"}
                  </Button>
                )}
              />
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
