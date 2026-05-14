"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
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

const AddAwardForm = ({
  mode,
  defaultValues,
  setOpen,
}: {
  mode: "edit" | "create";
  defaultValues?: Award;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
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

  const onSubmit = async (data: CreateAwardFormValues) => {
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

      <Controller
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
      />

      <Controller
        control={form.control}
        name="tags"
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [tagInput, setTagInput] = useState("");

          const addTag = () => {
            const trimmed = tagInput.trim();
            if (!trimmed) return;
            const current: string[] = Array.isArray(field.value) ? field.value : [];
            if (current.includes(trimmed)) return;
            field.onChange([...current, trimmed]);
            setTagInput("");
          };

          const removeTag = (tag: string) => {
            const current: string[] = Array.isArray(field.value) ? field.value : [];
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
                <button
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
                </button>
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
                      <button
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
                      </button>
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
