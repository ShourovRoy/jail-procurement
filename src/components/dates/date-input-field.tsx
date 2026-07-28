// components/date-picker-field.tsx
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, isValidDate } from "@/helpers/date-helper";
import { InputFieldError } from "@/components/error-fields/input-error-field";

type Props = {
  field: any; // swap for your FieldApi<...> generic if you have it
  label: string;
  placeholder?: string;
};

export function DatePickerField({
  field,
  label,
  placeholder = "June 01, 2025",
}: Props) {
  const [open, setOpen] = React.useState(false);

  // field.state.value is the source of truth: an ISO string or ""
  const selectedDate = field.state.value
    ? new Date(field.state.value)
    : undefined;

  const [month, setMonth] = React.useState<Date | undefined>(selectedDate);
  const [textValue, setTextValue] = React.useState(formatDate(selectedDate)); // human-readable display

  // keep the visible text synced if the field value ever changes from outside (e.g. form.reset)
  React.useEffect(() => {
    const d = field.state.value ? new Date(field.state.value) : undefined;
    setTextValue(formatDate(d));
    if (d) setMonth(d);
  }, [field.state.value]);

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={field.name}
          value={textValue}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const typed = e.target.value;
            setTextValue(typed); // let them type freely

            const parsed = new Date(typed);
            if (isValidDate(parsed)) {
              field.handleChange(parsed.toISOString()); // only commit to form when valid
              setMonth(parsed);
            }
            // if invalid/partial, don't touch field.state.value — avoids the toISOString() crash
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label={`Select ${label.toLowerCase()}`}
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  if (date) {
                    field.handleChange(date.toISOString()); // ✅ this was missing — the actual bug
                    setTextValue(formatDate(date));
                    setMonth(date);
                  }
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <InputFieldError field={field} />
    </Field>
  );
}
