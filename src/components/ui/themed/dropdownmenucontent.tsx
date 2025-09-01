import { DropdownMenuContent } from "../dropdown-menu";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const ThemedDropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    className={cn(
      "bg-secondary-container text-secondary-container-foreground border border-secondary-container-border rounded-lg shadow-lg transition-colors duration-150 ease-in-out",
      className
    )}
    {...props}
  />
));

ThemedDropdownMenuContent.displayName = "ThemedDropdownMenuContent";
export default ThemedDropdownMenuContent;
