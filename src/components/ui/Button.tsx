import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-[#659364] text-white shadow-sm hover:bg-[#547c53] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        primary:
          "bg-[#659364] text-white shadow-sm hover:bg-[#547c53] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-[#659364]/50 hover:shadow-2xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#659364] dark:text-[#8cb88b] underline-offset-4 hover:underline",
        gradient:
          "bg-[#659364] text-white shadow-sm hover:bg-[#547c53] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        amber:
          "bg-amber-600 text-white hover:bg-amber-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-6 text-base",
        icon: "h-9 w-9 rounded-xl",
        "icon-sm": "h-7 w-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
