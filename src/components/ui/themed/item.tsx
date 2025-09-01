import { SelectItem } from "../select";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const ThemedSelectItem = forwardRef<
  ElementRef<typeof SelectItem>,
  ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn(
      "text-secondary-container-foreground hover:bg-secondary-container-muted focus:bg-secondary-container-muted rounded-lg aria-selected:bg-secondary-container-muted aria-selected:text-white transition-colors duration-150 ease-in-out",
      className
    )}
    {...props}
  />
));

ThemedSelectItem.displayName = "ThemedSelectItem";
export default ThemedSelectItem;
