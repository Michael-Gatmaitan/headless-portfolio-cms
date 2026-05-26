"use client";

import StackIcon from "tech-stack-icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const ContinueUsingGoogleButton = () => {
  return (
    <div className="lg:flex lg:justify-center">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full lg:max-w-[250px]"
        onClick={async () => {
          await signIn("google", {
            callbackUrl: "/dashboard",
          });
        }}
      >
        <StackIcon name="google" className="w-4 h-4" />
        Continue using Google
      </Button>
    </div>
  );
};

export default ContinueUsingGoogleButton;
