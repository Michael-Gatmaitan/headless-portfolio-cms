"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { File } from "lucide-react";
import { User } from "@portfolio-types/shared";
import AvatarUserProfilePicture from "./layout/dashboard/AvatarUserProfilePicture";
import SidebarHeaderMenuItem from "./layout/app-sidebar/SidebarHeaderMenuItem";
import AuthenticatedSidebarGroup from "./layout/app-sidebar/AuthenticatedSidebarGroup";
import LogoutButton from "./layout/app-sidebar/LogoutButton";
import LoginButton from "./layout/app-sidebar/LoginButton";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";

const AppSidebar = () => {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarHeaderMenuItem />
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Getting started</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="grid gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/docs">
                    <File />
                    <span>Documentation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {session?.user ? <AuthenticatedSidebarGroup /> : null}

        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            {!session?.user ? (
              <SidebarMenu className="grid gap-1">
                <SidebarMenuItem>
                  <LoginButton />
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              <SidebarMenu className="flex gap-1">
                <SidebarMenuItem>
                  <ThemeToggle />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <LogoutButton />
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              {session?.user ? (
                <div className="flex flex-1 items-center gap-2">
                  <AvatarUserProfilePicture user={session.user as User} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session?.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    Made with 💗 by Michael Gatmaitan
                  </span>
                  <span className="truncate text-xs">
                    Create your account now ^^
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
