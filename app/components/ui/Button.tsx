import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "white";
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
}

interface ButtonButtonProps extends ButtonBaseProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

type ButtonProps = ButtonLinkProps | ButtonButtonProps;

export function Button(props: ButtonProps) {
  const baseClasses =
    "font-medium rounded-lg text-lg transition-colors inline-flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    white: "bg-white text-blue-600 hover:bg-gray-100 shadow-lg",
  };

  const sizeClasses = {
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-3 py-1.5",
    md: "px-4 py-2",
    lg: "text-lg px-5 py-2.5",
  };

  const {
    variant = "primary",
    children,
    className = "",
    size = "md",
  } = props;

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  // Jika props memiliki href, maka ini adalah ButtonLink
  if ("href" in props) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  // Jika tidak, ini adalah ButtonButton
  return (
    <button
      className={classes}
      onClick={props.onClick}
      type={props.type || "button"}
    >
      {children}
    </button>
  );
}
