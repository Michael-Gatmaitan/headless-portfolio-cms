"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  EditProjectFormValues,
  editProjectSchema,
} from "@/lib/zod-schemas/projects-schema";
import { Project } from "@portfolio-types/shared";
import { useEditProject } from "@/hooks/useProjects";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import Image from "next/image";
import { uploadProjectThumbnail } from "@/lib/imagekit";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const EditProjectForm = ({
  project,
  setOpen,
}: {
  project: Project;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const session = useSession();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });
  const [preview, setPreview] = useState<string>(project.thumbnail || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const [progress, setProgress] = useState(0);
  const [uploaded, setUpdloaded] = useState<boolean>(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(e.target.value);
    }
  };

  const handleUpload = async (): Promise<string | undefined | null> => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;
    }
    const file = fileInput.files[0];
    if (!file) return null;
    if (!session.data?.user?.name) return null;

    const url = await uploadProjectThumbnail({
      file: file as File,
      userName: session.data.user.name,
      abortSignal: abortController.signal,
      dir: "project-thumbnails",
      mode: {
        type: "edit",
        toReplace: project.thumbnail!,
      },
      onProgress: (percent) => setProgress(percent),
    });

    if (url) {
      setUpdloaded(true);
    } else {
      setUpdloaded(false);
    }

    return url;
  };

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      url: project.url,
      github: project.github,
      dateRange: project.dateRange,
      thumbnail: project.thumbnail || "",
    },
  });

  const { mutate: editProject } = useEditProject();

  const onSubmit = async (data: EditProjectFormValues) => {
    const url = await handleUpload();

    const updatedData = {
      ...data,
      thumbnail: url || data.thumbnail,
    };

    editProject(
      { id: project.id, data: updatedData },
      {
        onSuccess: () => {
          if (setOpen) setOpen(false);
          form.reset();
        },
      },
    );
  };

  return (
    <form
      id="edit-project"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="relative w-fit">
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border mb-4">
            <Image
              src={preview}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-64 items-center justify-center rounded-lg border border-dashed bg-muted mb-4">
            <p className="text-sm text-muted-foreground">No image selected</p>
          </div>
        )}
        <Controller
          name="thumbnail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>
              <Input
                {...field}
                type="file"
                ref={fileInputRef}
                id={field.name}
                placeholder="Select image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, field.onChange)}
                aria-invalid={fieldState.invalid}
                value={undefined} // File inputs should be uncontrolled for value
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter project title"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter project description"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="url"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter project URL"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="github"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Github Repository</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter project Github repository"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="dateRange"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="date-picker-range">
              Date Picker Range
            </FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-start px-2.5 font-normal"
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate?.from && newDate?.to) {
                      field.onChange(
                        `${format(newDate.from, "LLL dd, y")} - ${format(
                          newDate.to,
                          "LLL dd, y",
                        )}`,
                      );
                    } else if (newDate?.from) {
                      field.onChange(format(newDate.from, "LLL dd, y"));
                    } else {
                      field.onChange("");
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};

export default EditProjectForm;
