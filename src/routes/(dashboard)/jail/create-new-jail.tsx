import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createJailCommand } from "@/utils/jail-utils";
import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/(dashboard)/jail/create-new-jail")({
  component: RouteComponent,
});

function RouteComponent() {
  const { queryClient } = Route.useRouteContext();
  const jailForm = useForm({
    defaultValues: {
      name: "",
      address: "",
      district: "",
      phone_number: "",
    },
    onSubmit: async ({ value, formApi }) => {
      // call the create jail command util
      const res = await createJailCommand(value);

      // handle error message if exist
      if (res?.error) {
        toast.error(res.error.error_message || "Failed to create jail!");
      }

      // handle success message
      if (res?.success) {
        toast.success(res.success.message);

        // invalidate jails query cache and refetch
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["jails"] }),
          queryClient.refetchQueries({
            queryKey: ["jails"],
          }),
        ]);

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
            await jailForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Jail</CardTitle>
              <CardDescription>
                Create a new jail by filling out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* jail name field */}

              <jailForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Jail name is required!";
                    }

                    if (value.length < 4) {
                      return "Invalid jail name!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Jail Name</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Abhaynagar Jail"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* district field */}
              <jailForm.Field
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
              <jailForm.Field
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

              {/* address field  */}
              <jailForm.Field
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
              <jailForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Add new jail"}
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

export const InputFieldError = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      <FieldError>
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      </FieldError>
    </>
  );
};
