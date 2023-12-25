import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="flex justify-end items-center p-2 shadow-md">
      <ThemeToggle />
    </header>
  );
}
