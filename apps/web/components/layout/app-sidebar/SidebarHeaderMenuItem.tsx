"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Cog, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SidebarHeaderMenuItem = () => {
  const { open, setOpen } = useSidebar();

  return (
    <SidebarMenuItem className="flex gap-2 items-center">
      <Link href="/">
        <SidebarMenuButton size="lg" asChild>
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen(!open ? true : open);
              }}
              size="icon"
              className={open ? "hidden" : "flex"}
            >
              <PanelLeftOpen />
            </Button>

            <div
              className={`h-[30px] w-[30px] overflow-hidden rounded-md ${open ? "block" : "hidden"}`}
            >
              <Image src="/logo.png" width={100} height={100} alt="logo" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">fetchfolio️</span>
              <span className="truncate text-xs">
                A headless CMS for your portfolio
              </span>
            </div>
          </div>
        </SidebarMenuButton>
      </Link>

      {open ? <SidebarTrigger size="icon-lg" variant="ghost" /> : null}
    </SidebarMenuItem>
  );
};

export default SidebarHeaderMenuItem;
