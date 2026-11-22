import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent px-5 text-sm font-extrabold transition-[background-color,border-color,color,transform,box-shadow] duration-150 active:scale-[0.97] focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[1.1em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_10px_22px_-10px_rgba(11,74,201,0.55)] hover:bg-primary-hover",
        outline: "border-border bg-card text-foreground hover:border-primary/45 hover:bg-[#faf8f4]",
        ghost: "text-primary hover:bg-accent",
        destructive: "bg-destructive text-white hover:bg-red-900",
      },
      size: {
        default: "",
        lg: "min-h-[3.35rem] px-6 text-base",
        icon: "size-11 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({ className, variant, size, ...props }: Omit<ButtonPrimitive.Props, "className"> & { className?: string } & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
