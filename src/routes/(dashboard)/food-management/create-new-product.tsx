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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { getAllUnitsCommand } from "@/utils/unit-utils";
import { createNewProductUtilCommand } from "@/utils/product-utils";

export const Route = createFileRoute(
  "/(dashboard)/food-management/create-new-product",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["units"],
    queryFn: getAllUnitsCommand,
  });

  const productForm = useForm({
    defaultValues: {
      name: "",
      unit_id: "",
      description: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await createNewProductUtilCommand(value);

      if (res?.error) {
        toast.error(res.error.error_message || "Failed to create product!");
      }

      if (res?.success) {
        toast.success(res.success.message);

        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["units"] }),
          queryClient.refetchQueries({ queryKey: ["units"] }),
        ]);

        formApi.reset();
      }
    },
  });

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

            await productForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Product</CardTitle>
              <CardDescription>
                Create a new food product by filling out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <productForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Product name is required!";
                    }

                    if (value.length < 2) {
                      return "Invalid product name!";
                    }
                  },
                }}
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="Rice"
                    />
                    <InputFieldError field={field} />
                  </Field>
                )}
              />

              <productForm.Field
                name="unit_id"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Unit is required!";
                    }
                  },
                }}
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Select Unit</FieldLabel>
                    <Select
                      disabled={isLoading}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="Select a Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {data?.success?.data?.units.map((unit, index) => (
                            <SelectItem
                              key={unit.unit.id || index}
                              value={unit.unit.id}
                            >
                              {unit.unit.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <InputFieldError field={field} />
                  </Field>
                )}
              />

              <productForm.Field
                name="description"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      placeholder="Describe the product"
                    />
                    <InputFieldError field={field} />
                  </Field>
                )}
              />
            </CardContent>
            <CardFooter>
              <productForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit}>
                    {isSubmitting ? <Spinner /> : "Create Product"}
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
