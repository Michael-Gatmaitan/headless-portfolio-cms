"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { LogIn } from "lucide-react";

const LoginButton = () => {
  return (
    <SidebarMenuButton asChild>
      <Link href="/login">
        <LogIn />
        <span>Login</span>
      </Link>
    </SidebarMenuButton>
  );
};

export default LoginButton;
