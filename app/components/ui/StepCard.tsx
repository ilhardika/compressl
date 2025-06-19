import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface StepCardProps {
  number: number;
  icon: ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

export function StepCard({
  number,
  icon,
  title,
  description,
  isLast = false,
}: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Number circle */}
      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 z-10">
        {number}
      </div>

      {/* Horizontal connecting line */}
      {!isLast && (
        <div className="hidden md:block absolute top-6 left-[calc(50%+6px)] w-[calc(100%-12px)] h-0.5 bg-blue-200 z-0"></div>
      )}

      {/* Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full">
        <div
          className={cn(
            "text-blue-600 mb-4",
            "flex justify-center md:justify-start"
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            "text-xl font-semibold mb-3 text-gray-900",
            "text-center md:text-left"
          )}
        >
          {title}
        </h3>
        <p className={cn("text-gray-700", "text-center md:text-left")}>
          {description}
        </p>
      </div>
    </div>
  );
}
