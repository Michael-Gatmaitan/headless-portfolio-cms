import React from "react";
import LoginForm from "@/components/layout/(auth)/login/LoginForm";
import ContinueUsingGoogleButton from "@/components/ContinueUsingGoogleButton";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
};

const page = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:h-full lg:min-h-0 lg:flex-1 lg:pb-8">
      <div className="w-full lg:h-full lg:px-24">
        <div className="space-y-3">
          <div className="space-y-2">
            <div>Logo</div>
            <div className="font-bold text-3xl">Sign in</div>
          </div>

          <div>
            <LoginForm />
          </div>

          <ContinueUsingGoogleButton />
        </div>
      </div>

      <div className="hidden min-h-0 w-full rounded-2xl bg-primary lg:flex lg:h-full p-4">
        <div className="w-full h-full bg-background rounded-xl overflow-hidden p-12">
          <div className="space-y-4">
            <div>
              <Image
                src="/logo-cropped.png"
                width={200}
                height={200}
                alt="logo"
              />
            </div>

            <div>
              <Image
                src="/logo-text.png"
                width={100}
                height={100}
                alt="logo-text"
              />
            </div>
          </div>

          <div className="mt-12 space-y-2">
            <h1 className="font-bold text-3xl">Welcome to fetchfolio</h1>
            <p className="font-mono">
              Where developers can manage their portfolio data without updating
              it manually in their codebase using API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
