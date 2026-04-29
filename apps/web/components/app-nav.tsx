"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

const AppNav = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  // const session = useSession();
  // const router = useRouter();

  const title = (pathname.charAt(1).toUpperCase() + pathname.slice(2)).replace(
    "/",
    " -> ",
  );

  return (
    <nav className="p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">{title}</div>

      <Button
        className="lg:hidden"
        size="icon"
        variant="ghost"
        onClick={toggleSidebar}
      >
        <Menu />
      </Button>
    </nav>
  );
};

export default AppNav;
