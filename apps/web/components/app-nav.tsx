"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

const AppNav = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const title = (pathname.charAt(1).toUpperCase() + pathname.slice(2)).replace(
    "/",
    " -> ",
  );

  return (
    <nav className="p-4 flex justify-between items-center">
      {!pathname.includes("login") && (
        <div className="text-2xl font-bold">{title}</div>
      )}

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
