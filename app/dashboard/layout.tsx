import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Home, Image, History, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, icon, label, isActive = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-2 px-4 rounded-lg transition-colors",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center mr-2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-files"
                >
                  <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                  <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                  <path d="M15 2v5h5" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">Compressly</span>
            </Link>

            <nav className="hidden md:flex space-x-1">
              <NavItem
                href="/dashboard"
                icon={<Home size={18} />}
                label="Dashboard"
                isActive={true}
              />
              <NavItem
                href="/compress"
                icon={<Image size={18} />}
                label="Compress"
              />
              <NavItem
                href="/dashboard/history"
                icon={<History size={18} />}
                label="History"
              />
              <NavItem
                href="/dashboard/settings"
                icon={<SettingsIcon size={18} />}
                label="Settings"
              />
            </nav>
          </div>

          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
