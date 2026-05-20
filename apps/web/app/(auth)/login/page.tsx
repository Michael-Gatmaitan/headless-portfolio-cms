"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { LoginInput } from "@portfolio-types/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useLogin";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    login(data);
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="text-2xl text-center max-w-3xs font-bold">
          Hello, ready to add something today?
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup className="gap-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  name={field.name}
                  id="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  name={field.name}
                  type="password"
                  id="password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign In"}
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const result = await signIn("google", {
              callbackUrl: "/dashboard",
            });
          }}
        >
          Google
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
