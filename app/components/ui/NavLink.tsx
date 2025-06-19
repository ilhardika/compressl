import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface NavLinkBaseProps {
  children: ReactNode;
  className?: string;
}

interface NavLinkAnchorProps extends NavLinkBaseProps {
  href: string;
  isAnchor: true;
}

interface NavLinkRouterProps extends NavLinkBaseProps {
  href: string;
  isAnchor?: false;
}

type NavLinkProps = NavLinkAnchorProps | NavLinkRouterProps;

function NavLinkAnchor({
  href,
  children,
  className,
}: Omit<NavLinkAnchorProps, "isAnchor">) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function NavLinkRouter({
  href,
  children,
  className,
}: Omit<NavLinkRouterProps, "isAnchor">) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function NavLink(props: NavLinkProps) {
  const baseClasses =
    "text-gray-700 hover:text-blue-600 transition-colors font-medium";

  const { children, className = "" } = props;
  const classes = cn(baseClasses, className);

  // Jika isAnchor diatur ke true atau href dimulai dengan #, gunakan anchor tag
  if (
    props.isAnchor === true ||
    (!("isAnchor" in props) && props.href.startsWith("#"))
  ) {
    return (
      <NavLinkAnchor href={props.href} className={classes}>
        {children}
      </NavLinkAnchor>
    );
  }

  // Jika tidak, gunakan Link dari Next.js
  return (
    <NavLinkRouter href={props.href} className={classes}>
      {children}
    </NavLinkRouter>
  );
}
