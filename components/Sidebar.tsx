"use client";
import useSidebarStore from "@/store/sidebarStore";
import { Download, FilmIcon } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <div className="relative">
      <div
        className={`absolute z-50 top-0 left-0 h-screen w-64 space-y-6 p-8 border bg-background transition duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link className="flex items-center" href="/" onClick={toggleSidebar}>
          <Download className="h-[1.2rem] w-[1.2rem] mr-2" />
          <p>Downloader</p>
        </Link>

        <Link className="flex items-center" href="/translator" onClick={toggleSidebar}>
          <FilmIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
          <p>Translator</p>
        </Link>
      </div>
    </div>
  );
}
