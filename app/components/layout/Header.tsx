import { FilesIcon } from "lucide-react";
import Link from "next/link";
import { NavLink } from "../ui/NavLink";
import { Button } from "../ui/Button";

export function Header() {
  // Sesuaikan navItems dengan id section yang ada di project
  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#cta", label: "Compress" },
  ];

  return (
    <header className="py-5 px-4 sm:px-6 lg:px-8 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3 text-white">
            <FilesIcon className="h-6 w-6" />
          </div>
          <div className="text-xl font-bold text-gray-900">Compressly</div>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          href="/compress"
          variant="primary"
          className="py-2 px-5 text-base"
        >
          Login
        </Button>
      </div>
    </header>
  );
}
