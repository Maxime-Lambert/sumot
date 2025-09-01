import { DropdownMenuTrigger } from "../dropdown-menu";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const ThemedDropdownMenuTrigger = forwardRef<
  ElementRef<typeof DropdownMenuTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuTrigger
    ref={ref}
    className={cn(
      "text-secondary-container-foreground rounded-lg px-4 py-2 hover:text-secondary-container-foreground/70 transition duration-150 ease-in-out",
      className
    )}
    {...props}
  />
));

ThemedDropdownMenuTrigger.displayName = "ThemedDropdownMenuTrigger";
export default ThemedDropdownMenuTrigger;
