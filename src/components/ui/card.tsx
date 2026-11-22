import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card" className={cn("rounded-3xl border border-border bg-card text-card-foreground shadow-[0_14px_34px_-24px_rgba(10,26,60,0.16)]", className)} {...props} />;
}
