"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  createAwardSchema,
  CreateAwardFormValues,
} from "@/lib/zod-schemas/awards-schema";
import { useCreateAward, useUpdateAward } from "@/hooks/useAwards";
import { Award } from "@portfolio-types/shared";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { imageKitFolders, uploadImageToImageKit } from "@/lib/imagekit";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const AddAwardForm = ({
  mode,
  defaultValues,
  setOpen,
  setIsPending,
}: {
  mode: "edit" | "create";
  defaultValues?: Award;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsPending?: (pending: boolean) => void;
}) => {
  const session = useSession();
  const [preview, setPreview] = useState<string>(
    defaultValues?.thumbnail || "",
  );
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
      dir: imageKitFolders.awards.thumbnail,
      onProgress: (percent) => setProgress(percent),
    });

    if (url) {
      setUpdloaded(true);
    } else {
      setUpdloaded(false);
    }

    return url;
  };

  const form = useForm({
    resolver: zodResolver(createAwardSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      shortDescription: defaultValues?.shortDescription || "",
      longDescription: defaultValues?.longDescription || "",
      year: defaultValues?.year || "",
      tags: defaultValues?.tags || [],
      thumbnail: defaultValues?.thumbnail || "",
    },
  });

  const { mutateAsync: createAward, isPending: isCreating } = useCreateAward();
  const { mutateAsync: updateAward, isPending: isUpdating } = useUpdateAward();

  const isFormPending = form.formState.isSubmitting || isCreating || isUpdating;

  useEffect(() => {
    setIsPending?.(isFormPending);
  }, [isFormPending, setIsPending]);

  const onSubmit = async (data: CreateAwardFormValues) => {
    if (!uploaded) {
      const url = await handleUpload();
      if (!url) {
        toast.error("Image upload failed");
        return;
      }
      data.thumbnail = url;
    }

    if (mode === "create") {
      await createAward(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    } else {
      if (!defaultValues) {
        toast.error("No award data provided");
        return;
      }

      await updateAward(
        { id: defaultValues!.id, data },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        },
      );
    }
  };

  return (
    <form
      id="add-award"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Award title"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="shortDescription"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Short description</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Short description about the award"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="longDescription"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Long description</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Long description about the award"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="year"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Year</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Year"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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
          <div className="flex my-2 aspect-video w-64 items-center justify-center rounded-lg border border-dashed bg-muted">
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

      {/* <Controller
        control={form.control}
        name="thumbnail"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Thumbnail</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Thumbnail"
              aria-invalid={fieldState.invalid}
              value={field.value || ""}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      /> */}

      <Controller
        control={form.control}
        name="tags"
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [tagInput, setTagInput] = useState("");

          const addTag = () => {
            const trimmed = tagInput.trim();
            if (!trimmed) return;
            const current: string[] = Array.isArray(field.value)
              ? field.value
              : [];
            if (current.includes(trimmed)) return;
            field.onChange([...current, trimmed]);
            setTagInput("");
          };

          const removeTag = (tag: string) => {
            const current: string[] = Array.isArray(field.value)
              ? field.value
              : [];
            field.onChange(current.filter((t) => t !== tag));
          };

          const tags: string[] = Array.isArray(field.value) ? field.value : [];

          return (
            <Field>
              <FieldLabel>Tags</FieldLabel>

              {/* Tag input row */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Input
                  id="tags-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Type a tag and click Add"
                  aria-invalid={fieldState.invalid}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={addTag}
                  style={{
                    padding: "0 1rem",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    background: "#333",
                    color: "#fff",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontSize: "0.875rem",
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Tag chips */}
              {tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        background: "#2a2a2a",
                        border: "1px solid #444",
                        fontSize: "0.8rem",
                        color: "#e0e0e0",
                      }}
                    >
                      {tag}
                      <Button
                        variant="outline"
                        type="button"
                        aria-label={`Remove tag ${tag}`}
                        onClick={() => removeTag(tag)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#aaa",
                          lineHeight: 1,
                          padding: 0,
                          fontSize: "1rem",
                        }}
                      >
                        ×
                      </Button>
                    </span>
                  ))}
                </div>
              )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </form>
  );
};

export default AddAwardForm;
