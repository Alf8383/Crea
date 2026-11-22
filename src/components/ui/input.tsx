import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const inputClassName = "min-h-12 w-full rounded-xl border border-input bg-[#faf8f4] px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:bg-white aria-invalid:border-destructive";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input data-slot="input" className={cn(inputClassName, className)} {...props} />;
}
