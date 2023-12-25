"use client";
import { MenuIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import useSidebarStore from "@/store/sidebarStore";
import { Button } from "./ui/button";

export default function Header() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <header className="flex justify-between items-center border p-2 z-50">
      <Button variant="ghost" onClick={toggleSidebar}>
        <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <ThemeToggle />
    </header>
  );
}
