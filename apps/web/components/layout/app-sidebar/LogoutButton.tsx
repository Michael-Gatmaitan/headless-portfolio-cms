"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  return (
    <SidebarMenuButton asChild>
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={() => signOut()}
      >
        <LogOut />
        <span>Logout</span>
      </Button>
    </SidebarMenuButton>
  );
};

export default LogoutButton;
