"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  editJobSchema,
  type EditJobFormInput,
  type EditJobFormValues,
} from "@/lib/zod-schemas/jobs-schema";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useUpdateJob } from "@/hooks/useJobs";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Job } from "@portfolio-types/shared";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const EditJobForm = ({
  job,
  setOpen,
  setIsPending,
}: {
  job: Job;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsPending?: (pending: boolean) => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(
    job.dateApplied ? new Date(job.dateApplied) : new Date()
  );

  const form = useForm<EditJobFormInput, unknown, EditJobFormValues>({
    resolver: zodResolver(editJobSchema),
    defaultValues: {
      companyName: job.companyName ?? "",
      role: job.role ?? "",
      location: job.location ?? "",
      salaryRange: job.salaryRange ?? "",
      status: job.status ?? "Applied",
      notes: job.notes ?? "",
      platform: job.platform ?? "",
      dateApplied: date ? date.toISOString() : new Date().toISOString(),
    },
  });

  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();
  const isFormPending = form.formState.isSubmitting || isUpdating;

  useEffect(() => {
    setIsPending?.(isFormPending);
  }, [isFormPending, setIsPending]);

  const onSubmit = async (data: EditJobFormValues) => {
    console.log("Updated Job: ", data);
    updateJob(
      { id: job.id, data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <form
      id={`edit-job-${job.id}`}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 pr-1"
    >
      <Controller
        name="companyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter company name"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="role"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Role</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter role (e.g. Software Engineer)"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Location</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="e.g. Remote, San Francisco"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="salaryRange"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Salary Range</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="e.g. $120k - $150k"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offered">Offered</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="platform"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Platform</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="e.g. LinkedIn, Indeed, Glassdoor"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="dateApplied"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="date-picker-applied-edit">Date Applied</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-applied-edit"
                  className="justify-start px-2.5 font-normal w-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      field.onChange(newDate.toISOString());
                    } else {
                      field.onChange("");
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="notes"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Add any interview questions, contact info or reminders here..."
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};
