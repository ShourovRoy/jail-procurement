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
import { createNewUnitUtilCommand } from "@/utils/unit-utils";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/(dashboard)/food-management/create-new-unit",
)({
  component: RouteComponent,
});

function RouteComponent() {
  //   unit form
  const unitForm = useForm({
    defaultValues: {
      name: "",
      short_name: "",
    },
    onSubmit: async ({ value, formApi }) => {
      // call the create jail command util
      const res = await createNewUnitUtilCommand(value);

      // handle error message if exist
      if (res?.error) {
        toast.error(res.error.error_message || "Failed to create jail!");
      }

      // handle success message
      if (res?.success) {
        toast.success(res.success.message);

        // invalidate unit query cache and refetch
        // Promise.all([
        //   queryClient.invalidateQueries({ queryKey: ["product"] }),
        //   queryClient.refetchQueries({
        //     queryKey: ["product"],
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
            await unitForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Unit</CardTitle>
              <CardDescription>
                Create a new unit by filling out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* unit name field */}

              <unitForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Unit name is required!";
                    }

                    if (value.length < 2) {
                      return "Invalid unit name!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Unit Name</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Kilogram"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />

              {/* short name field */}
              <unitForm.Field
                name="short_name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Short name required!";
                    }
                  },
                }}
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Short Name</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Kg"
                      />
                      <InputFieldError field={field} />
                    </Field>
                  );
                }}
              />
            </CardContent>
            <CardFooter>
              <unitForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Add new unit "}
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
