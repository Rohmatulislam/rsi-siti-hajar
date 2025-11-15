import * as React from "react";
import { cn } from "@/lib/utils";

// =====================================================
//  BASE CARD (clean, modern, emerald theme friendly)
// =====================================================
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "group/card",
        "bg-white/85 dark:bg-gray-900/80",
        "backdrop-blur-md border border-emerald-100 dark:border-emerald-900/40",
        "rounded-2xl shadow-sm",
        "flex flex-col gap-4",
        "transition-all duration-300",
        "hover:shadow-lg hover:shadow-emerald-100/40 dark:hover:shadow-emerald-900/30",
        "hover:border-emerald-300 dark:hover:border-emerald-700",
        "hover:-translate-y-1",
        "p-6",
        className
      )}
      {...props}
    />
  );
}

// =====================================================
//   CARD HEADER
// =====================================================
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-2",
        "border-b border-gray-100 dark:border-gray-700 pb-4",
        className
      )}
      {...props}
    />
  );
}

// =====================================================
//   CARD TITLE
// =====================================================
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-xl font-semibold tracking-tight",
        "text-gray-900 dark:text-gray-100",
        "group-hover/card:text-emerald-700 dark:group-hover/card:text-emerald-400",
        "transition-colors",
        className
      )}
      {...props}
    />
  );
}

// =====================================================
//   CARD DESCRIPTION
// =====================================================
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-gray-600 dark:text-gray-300 text-sm leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

// =====================================================
//   CARD ACTION (icon/button on top right)
// =====================================================
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "ml-auto -mt-2",
        "transition-transform duration-300",
        "group-hover/card:scale-110 group-hover/card:translate-x-1",
        className
      )}
      {...props}
    />
  );
}

// =====================================================
//   CARD CONTENT
// =====================================================
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("pt-2 transition-all duration-300", className)}
      {...props}
    />
  );
}

// =====================================================
//   CARD FOOTER
// =====================================================
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center pt-4 border-t border-gray-100 dark:border-gray-700",
        className
      )}
      {...props}
    />
  );
}

// =====================================================
//   OPTIONAL VARIANT: MINIMAL CARD (clean simple)
// =====================================================
function CardMinimal({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-minimal"
      className={cn(
        "group/card",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-700",
        "rounded-xl p-5",
        "transition-all duration-300",
        "hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardMinimal,
};
