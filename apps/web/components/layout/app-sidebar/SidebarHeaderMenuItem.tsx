"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Cog, PanelLeftOpen } from "lucide-react";

const SidebarHeaderMenuItem = () => {
  const { open, setOpen } = useSidebar();

  return (
    <SidebarMenuItem className="flex gap-2 items-center">
      <SidebarMenuButton
        size="lg"
        asChild
        onClick={() => setOpen(!open ? true : open)}
      >
        <div>
          <Button size="icon">{!open ? <PanelLeftOpen /> : <Cog />}</Button>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Build ⚒️</span>
            <span className="truncate text-xs">A Multi-tenant project</span>
          </div>
        </div>
      </SidebarMenuButton>

      {open ? <SidebarTrigger size="icon-lg" variant="ghost" /> : null}
    </SidebarMenuItem>
  );
};

export default SidebarHeaderMenuItem;
