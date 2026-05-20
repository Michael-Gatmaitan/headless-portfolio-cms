import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const page = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-3xl font-bold">Hello</div>
      <ThemeToggle />
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  );
};

export default page;
