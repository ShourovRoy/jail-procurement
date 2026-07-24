import { AnyFieldApi } from "@tanstack/react-form";
import { FieldError } from "../ui/field";

export const InputFieldError = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      <FieldError>
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      </FieldError>
    </>
  );
};
