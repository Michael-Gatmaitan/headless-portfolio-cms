"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "@/lib/zod-schemas/projects-schema";
import { Calendar } from "@/components/ui/calendar";
import { useRef, useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { useCreateProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { imageKitFolders, uploadImageToImageKit } from "@/lib/imagekit";

const AddProjectForm = ({
  setOpen,
  setIsPending,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsPending?: (pending: boolean) => void;
}) => {
  const session = useSession();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });
  const [preview, setPreview] = useState<string>("");
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

  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return null;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];
    if (!file) return null;
    if (!session.data?.user?.name) return null;

    // Retrieve authentication parameters for the upload.
    const url = await uploadImageToImageKit({
      file: file as File,
      userName: session.data.user.name,
      abortSignal: abortController.signal,
      dir: imageKitFolders.projects.thumbnail,
      onProgress: (percent) => setProgress(percent),
    });

    if (url) {
      setUpdloaded(true);
    } else {
      setUpdloaded(false);
    }

    return url;
  };

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      github: "",
      dateRange: date
        ? `${format(date.from!, "LLL dd, y")} - ${format(date.to!, "LLL dd, y")}`
        : "",
      thumbnail: "",
    },
  });

  const { mutate: createProject, isPending: isCreating } = useCreateProject();

  const isFormPending = form.formState.isSubmitting || isCreating;

  useEffect(() => {
    setIsPending?.(isFormPending);
  }, [isFormPending, setIsPending]);

  const onSubmit = async (data: CreateProjectFormValues) => {
    const url = await handleUpload();
    if (!url) {
      toast.error("Image upload failed");
      return;
    }

    data.thumbnail = url as string;

    createProject(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <form
      id="add-project"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="relative w-fit">
        <FieldLabel>Thumbnail Preview</FieldLabel>
        {preview ? (
          <div className="relative my-2 aspect-video w-64 overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Project preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-64 items-center justify-center rounded-lg border border-dashed bg-muted">
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
                value={undefined}
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

export default AddProjectForm;
