import Link from "next/link";
import { FilesIcon, Twitter, Github, Youtube } from "lucide-react";
import { NavLink } from "../ui/NavLink";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#", label: "Pricing" },
    { href: "#", label: "FAQ" },
  ];

  const companyLinks = [
    { href: "#", label: "About Us" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Contact" },
  ];

  const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" },
  ];

  return (
    <footer className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center mr-2 text-white">
                <FilesIcon size={20} />
              </div>
              <div className="text-lg font-bold text-gray-900">Compressly</div>
            </div>
            <p className="text-gray-700 mb-6">
              The modern way to compress and optimize your images for web and
              apps.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} Compressly. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Github size={20} />
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Youtube size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
