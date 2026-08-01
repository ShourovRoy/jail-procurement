import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { InputFieldError } from "../jail/create-new-jail";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllJailCommand } from "@/utils/jail-utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { toast } from "sonner";
import { createTenderCommand } from "@/utils/tender-utils";

export const Route = createFileRoute("/(dashboard)/tenders/create-new-tender")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  // query jails
  const { data, isLoading, error } = useQuery({
    queryKey: ["jails"],
    queryFn: getAllJailCommand,
  });

  // tender form
  const tenderForm = useForm({
    defaultValues: {
      jail_id: "",
      tender_number: "",
      notice_number: "",
      estimated_amount: 0.0,
      remarks: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await createTenderCommand(value);

      // handle error message if exist
      if (res?.error) {
        toast.error(res.error.error_message || "Failed to create jail!");
      }

      // handle success message
      if (res?.success) {
        toast.success(res.success.message);

        // invalidate tenders query cache and refetch
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["tenders"] }),
          queryClient.refetchQueries({
            queryKey: ["tenders"],
          }),
        ]);

        // reset the form field on success

        formApi.reset();
      }
    },
  });

  // watch over error message
  useEffect(() => {
    if (error) {
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
            await tenderForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Tender</CardTitle>
              <CardDescription>
                Create a new tender by filling out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* tender number field */}

              <tenderForm.Field
                name="tender_number"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Tender number is required!";
                    }

                    if (value.length < 4) {
                      return "Invalid Tender number!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Tender Number
                      </FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="TND-DSBKAJE449E0N"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* notice_number */}
              <tenderForm.Field
                name="notice_number"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Notice number is required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Notice Number
                      </FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="NOT-233RLNLADNFOI"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* jail id (select jail) */}
              <tenderForm.Field
                name="jail_id"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Jail is required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Select Jail</FieldLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={(e) => field.handleChange(e)}
                      >
                        <SelectTrigger className="w-45">
                          <SelectValue placeholder="Select a Jail" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {data?.success?.data?.jails.map((jail, index) => (
                              <SelectItem
                                key={jail.jail.id || index}
                                value={jail.jail.id}
                              >
                                {jail.jail.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* remarks */}
              <tenderForm.Field
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
              <tenderForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Create New Tender"}
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
