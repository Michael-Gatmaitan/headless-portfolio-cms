"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  CreateSkillFormValues,
  createSkillSchema,
} from "@/lib/zod-schemas/skills-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { SkillComboBox } from "./MultipleSkillItemCombobox";
import { useCreateSkill, useSkills, useUpdateSkill } from "@/hooks/useSkills";
import { Skill } from "@portfolio-types/shared";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

const AddSkillForm = ({
  mode,
  defaultValues,
  setOpen,
  setIsPending,
}: {
  mode: "edit" | "create";
  defaultValues?: Skill;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsPending?: (pending: boolean) => void;
}) => {
  const form = useForm({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      tags: defaultValues?.tags || [],
    },
  });

  const { mutateAsync: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutateAsync: updateSkill, isPending: isUpdating } = useUpdateSkill();

  const isFormPending = form.formState.isSubmitting || isCreating || isUpdating;

  useEffect(() => {
    setIsPending?.(isFormPending);
  }, [isFormPending, setIsPending]);

  const onSubmit = async (data: CreateSkillFormValues) => {
    if (mode === "create") {
      await createSkill(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    } else {
      if (!defaultValues) {
        toast.error("No skill data provided");
        return;
      }

      await updateSkill(
        {
          id: defaultValues.id,
          data,
        },
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
      id="add-skill"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Skill title (e.g Frontend, Backend, DevOps)"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="tags"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
            <SkillComboBox value={field.value} onChange={field.onChange} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};

export default AddSkillForm;
