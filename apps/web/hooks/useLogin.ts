"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Logged in using credentials: ", result);

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back! 💪");
        router.push("/");
        router.refresh();
      }
    },
  });
};
