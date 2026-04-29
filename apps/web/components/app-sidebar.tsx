"use client";

import React from "react";
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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Award,
  Cog,
  FolderIcon,
  LayoutDashboardIcon,
  LogIn,
  LogOut,
  PanelLeftOpen,
  Settings,
  UserIcon,
  Wrench,
} from "lucide-react";
import { usePathname } from "next/navigation";
// import { signOut } from '@/lib/auth';
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import AvatarUserProfilePicture from "./layout/dashboard/AvatarUserProfilePicture";
import { User } from "@portfolio-types/shared";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserIcon,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderIcon,
  },
  {
    title: "Skills",
    url: "/skills",
    icon: Wrench,
  },
  {
    title: "Awards",
    url: "/awards",
    icon: Award,
  },
];

const AppSidebar = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2 items-center">
            <SidebarMenuButton
              size="lg"
              asChild
              onClick={() => setOpen(!open ? true : open)}
            >
              <div>
                <Button size="icon">
                  {!open ? <PanelLeftOpen /> : <Cog />}
                </Button>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Build ⚒️</span>
                  <span className="truncate text-xs">
                    A Multi-tenant project
                  </span>
                </div>
              </div>
            </SidebarMenuButton>

            {open ? <SidebarTrigger size="icon-lg" variant="ghost" /> : null}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {session?.user ? (
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="grid gap-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={!!pathName.match(item.url)}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="grid gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton isActive={!!pathName.match("/settings")}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {!session?.user ? (
              <SidebarMenu className="grid gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={!!pathName.match("/login")}
                  >
                    <Link href="/login">
                      <LogIn />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              <SidebarMenu className="grid gap-1">
                <SidebarMenuItem>
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
                <Link href="/profile">
                  <AvatarUserProfilePicture user={session.user as User} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session?.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user.email}
                    </span>
                  </div>
                </Link>
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
