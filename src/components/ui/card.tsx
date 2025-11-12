import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "group/card",
        "bg-white/80 backdrop-blur-sm",
        "text-card-foreground",
        "flex flex-col gap-6",
        "rounded-3xl border border-white/20",
        "shadow-sm shadow-black/5",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-black/10 hover:bg-white/90 hover:-translate-y-1",
        "dark:bg-gray-900/70 dark:border-gray-700/50 dark:shadow-black/30",
        "dark:hover:bg-gray-800/80 dark:hover:border-gray-600/50 dark:hover:shadow-black/40",
        "py-6",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header",
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-3",
        "px-6",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-6 [.border-b]:border-b [.border-b]:border-gray-100 dark:[.border-b]:border-gray-700",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "leading-none font-bold text-xl text-gray-900 tracking-tight",
        "dark:text-white dark:font-semibold",
        "group-hover/card:text-gray-950 dark:group-hover/card:text-gray-100",
        "transition-colors duration-300",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-gray-600 text-sm leading-relaxed",
        "dark:text-gray-300 dark:font-light",
        "group-hover/card:text-gray-700 dark:group-hover/card:text-gray-200",
        "transition-colors duration-300",
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        "transition-all duration-300 ease-out",
        "group-hover/card:scale-110 group-hover/card:translate-x-1",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6",
        "transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6",
        "[.border-t]:pt-6 [.border-t]:border-t [.border-t]:border-gray-100 dark:[.border-t]:border-gray-700",
        "transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}

// Modern card variants dengan dark mode yang lebih sophisticated
function CardGlass({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-glass"
      className={cn(
        "group/card",
        "bg-white/20 backdrop-blur-xl border border-white/30",
        "text-white",
        "flex flex-col gap-6",
        "rounded-3xl",
        "shadow-2xl shadow-black/20",
        "transition-all duration-500 ease-out",
        "hover:bg-white/30 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1",
        "dark:bg-gray-900/40 dark:backdrop-blur-2xl dark:border-gray-600/30",
        "dark:hover:bg-gray-800/50 dark:hover:border-gray-500/40",
        "py-6",
        className,
      )}
      {...props}
    />
  );
}

function CardGradient({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-gradient"
      className={cn(
        "group/card",
        "bg-gradient-to-br from-white to-gray-50",
        "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        "text-card-foreground",
        "flex flex-col gap-6",
        "rounded-3xl border border-gray-100",
        "dark:border-gray-700",
        "shadow-sm shadow-black/5",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1",
        "hover:from-white hover:to-gray-100",
        "dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-800",
        "dark:hover:border-gray-600",
        "py-6",
        className,
      )}
      {...props}
    />
  );
}

function CardHover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-hover"
      className={cn(
        "group/card",
        "bg-white dark:bg-gray-900",
        "text-card-foreground",
        "flex flex-col gap-6",
        "rounded-3xl border border-gray-200 dark:border-gray-700",
        "shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-2xl hover:scale-[1.02] hover:border-emerald-300 dark:hover:border-emerald-500",
        "hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30",
        "dark:hover:from-gray-900 dark:hover:to-emerald-900/10",
        "dark:hover:shadow-2xl dark:hover:shadow-emerald-900/20",
        "py-6",
        className,
      )}
      {...props}
    />
  );
}

function CardBorder({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-border"
      className={cn(
        "group/card",
        "bg-white dark:bg-gray-900",
        "text-card-foreground",
        "flex flex-col gap-6",
        "rounded-3xl",
        "shadow-sm",
        "transition-all duration-500 ease-out",
        "hover:shadow-xl hover:-translate-y-1",
        "relative overflow-hidden",
        "py-6",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-emerald-500 before:via-teal-500 before:to-cyan-500 before:opacity-0 before:transition-all before:duration-500",
        "hover:before:opacity-100 hover:before:scale-105",
        "after:absolute after:inset-[2px] after:rounded-3xl after:bg-white after:dark:bg-gray-900 after:transition-colors after:duration-500",
        "dark:after:bg-gradient-to-br dark:after:from-gray-900 dark:after:to-gray-800",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col gap-6 h-full">
        {props.children}
      </div>
    </div>
  );
}

// New modern dark mode variants
function CardNeon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-neon"
      className={cn(
        "group/card",
        "bg-gray-900",
        "text-white",
        "flex flex-col gap-6",
        "rounded-3xl border border-gray-700",
        "shadow-lg shadow-black/40",
        "transition-all duration-400 ease-out",
        "hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:border-cyan-400/50",
        "hover:bg-gradient-to-br hover:from-gray-800 hover:to-cyan-900/20",
        "relative overflow-hidden",
        "py-6",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/10 before:to-purple-500/10 before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function CardCyber({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-cyber"
      className={cn(
        "group/card",
        "bg-gray-900 border border-gray-600",
        "text-white",
        "flex flex-col gap-6",
        "rounded-xl",
        "shadow-2xl shadow-black/50",
        "transition-all duration-300 ease-out",
        "hover:shadow-purple-500/30 hover:-translate-y-1 hover:border-purple-400",
        "hover:bg-gray-800",
        "relative overflow-hidden",
        "py-6",
        "before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-cyan-400 before:to-purple-500 before:opacity-80",
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 after:opacity-0 after:transition-opacity after:duration-300",
        "hover:after:opacity-80",
        className,
      )}
      {...props}
    />
  );
}

function CardMinimal({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-minimal"
      className={cn(
        "group/card",
        "bg-transparent",
        "text-card-foreground",
        "flex flex-col gap-6",
        "rounded-2xl border border-gray-200",
        "dark:border-gray-700",
        "transition-all duration-300 ease-out",
        "hover:bg-white/50 dark:hover:bg-gray-800/30",
        "hover:border-gray-300 dark:hover:border-gray-600",
        "hover:shadow-lg dark:hover:shadow-black/40",
        "py-6",
        className,
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
  CardGlass,
  CardGradient,
  CardHover,
  CardBorder,
  CardNeon,
  CardCyber,
  CardMinimal,
};