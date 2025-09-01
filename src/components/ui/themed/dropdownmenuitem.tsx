import { DropdownMenuItem } from "../dropdown-menu";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const ThemedDropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuItem>
>(({ className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={cn(
      "text-secondary-container-foreground hover:bg-secondary-container-muted focus:bg-secondary-container-muted rounded-lg transition-colors duration-150 ease-in-out",
      className
    )}
    {...props}
  />
));

ThemedDropdownMenuItem.displayName = "ThemedDropdownMenuItem";
export default ThemedDropdownMenuItem;
