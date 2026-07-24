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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createOrgCommand } from "@/utils/org-utils";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/(dashboard)/organization/create-new-organization",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const orgForm = useForm({
    defaultValues: {
      name: "",
      proprietor_name: "",
      address: "",
      district: "",
      phone_number: "",
      email: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await createOrgCommand(value);
      // handle error message if exist
      if (res?.error) {
        toast.error(res.error.error_message || "Failed to create jail!");
      }

      // handle success message
      if (res?.success) {
        toast.success(res.success.message);

        // TODO:// invalidate ORGANIZATIONS query cache and refetch
        // Promise.all([
        //   queryClient.invalidateQueries({ queryKey: ["jails"] }),
        //   queryClient.refetchQueries({
        //     queryKey: ["jails"],
        //   }),
        // ]);

        // reset the form field on success

        formApi.reset();
      }
    },
  });
  return (
    <div>
      <div className="container mx-auto">
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();

            // call the form submit handler
            await orgForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Organization</CardTitle>
              <CardDescription>
                Create a new organization by filling out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* org name field */}

              <orgForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Org name is required!";
                    }

                    if (value.length < 4) {
                      return "Invalid jail name!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Organization Name
                      </FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Mou Enterprise"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* proprietor_name */}
              <orgForm.Field
                name="proprietor_name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Proprietor name is required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Proprietor Name
                      </FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Mou"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* district field */}
              <orgForm.Field
                name="district"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "District required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>District</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Jessore"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* phone number field  */}
              <orgForm.Field
                name="phone_number"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Phone number required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="tel"
                        placeholder="+880 1234 567890"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* email */}
              <orgForm.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Email name is required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="email"
                        placeholder="Mou"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* address field  */}
              <orgForm.Field
                name="address"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Address required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Address</FieldLabel>

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
              <orgForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Add new organization"}
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
