import { SelectContent } from "../select";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const ThemedSelectContent = forwardRef<
  ElementRef<typeof SelectContent>,
  ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => (
  <SelectContent
    ref={ref}
    className={cn(
      "bg-secondary-container text-secondary-container-foreground border border-secondary-container-border transition-colors duration-150 ease-in-out rounded-lg",
      className
    )}
    {...props}
  />
));

ThemedSelectContent.displayName = "ThemedSelectContent";
export default ThemedSelectContent;
