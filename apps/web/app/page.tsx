import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-3xl font-bold">Hello</div>
      <ThemeToggle />
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>

      <Image
        src="https://ik.imagekit.io/michaelgatmaitanpdb/default-image.jpg?updatedAt=1777634411929"
        width={100}
        height={100}
        alt="Image"
      />
    </div>
  );
};

export default page;
