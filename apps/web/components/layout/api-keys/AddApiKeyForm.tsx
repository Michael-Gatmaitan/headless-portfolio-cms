import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  CreateApiKeyFormValues,
  createApiKeySchema,
} from "@/lib/zod-schemas/api-keys-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { useCreateApiKey } from "@/hooks/useApiKeys";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, Copy } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ApiKeyResponseType } from "@portfolio-types/shared";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";

const AddApiKeyForm = ({
  setOpen,
  apiKeyResponse,
  setApiKeyResponse,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  apiKeyResponse: ApiKeyResponseType | undefined;
  setApiKeyResponse: Dispatch<SetStateAction<ApiKeyResponseType | undefined>>;
}) => {
  const form = useForm({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
      expiresAt: null,
    },
  });

  const { mutateAsync: createApiKey } = useCreateApiKey();

  const onSubmit = async (data: CreateApiKeyFormValues) => {
    await createApiKey(data, {
      onSuccess: (response) => {
        setApiKeyResponse(response.data);
        form.reset();
      },
    });
  };

  return (
    <form
      id="add-api-key"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {apiKeyResponse ? (
        <ApiKeyPreview apiKeyResponse={apiKeyResponse} />
      ) : (
        <>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Key name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="API Key name"
                  aria-invalid={!!fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="expiresAt"
            render={({ field, fieldState }) => {
              // Derive a Date object from the ISO string stored in RHF.
              // field.value is the single source of truth — no separate local state.
              const selectedDate = field.value
                ? new Date(field.value)
                : undefined;

              return (
                <Field>
                  <FieldLabel>Expiration Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!field.value}
                        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? null)
                        }
                        defaultMonth={selectedDate}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </>
      )}
    </form>
  );
};

const ApiKeyPreview = ({
  apiKeyResponse,
}: {
  apiKeyResponse: ApiKeyResponseType;
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="copy-api-key-input">API Key</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="copy-api-key-input"
          readOnly
          value={apiKeyResponse.data.key}
        />

        <InputGroupAddon
          align="inline-end"
          className="cursor-default"
          onClick={() => {
            navigator.clipboard.writeText(apiKeyResponse.data.key);
            toast.success("API Key copied successfully");
          }}
        >
          <Copy />
        </InputGroupAddon>
      </InputGroup>

      <FieldDescription>{apiKeyResponse.warning}</FieldDescription>
    </Field>
  );
};

export default AddApiKeyForm;
