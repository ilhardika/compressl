"use client";

import { FilesIcon } from "lucide-react";
import Link from "next/link";
import { NavLink } from "../ui/NavLink";
import { Button } from "../ui/Button";
import { UserButton, useAuth } from "@clerk/nextjs";

export function Header() {
  const { userId } = useAuth();
  const isSignedIn = !!userId;

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

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Button
                href="/compress"
                variant="secondary"
                className="py-2 px-4 text-base"
              >
                Compress
              </Button>
              <Button
                href="/dashboard"
                variant="secondary"
                className="py-2 px-4 text-base"
              >
                Dashboard
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <NavLink href="/sign-in" className="py-2">
                Sign In
              </NavLink>
              <Button
                href="/sign-up"
                variant="primary"
                className="py-2 px-5 text-base"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
