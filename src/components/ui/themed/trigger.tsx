import { SelectTrigger } from "../select";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const ThemedSelectTrigger = forwardRef<
  ElementRef<typeof SelectTrigger>,
  ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    className={cn(
      "bg-secondary-container text-secondary-container-foreground border border-secondary-container-border rounded-lg px-4 py-2 hover:bg-secondary-container-muted/70 focus:ring-1 focus:ring-primary transition duration-150 ease-in-out",
      className
    )}
    {...props}
  />
));

ThemedSelectTrigger.displayName = "ThemedSelectTrigger";
export default ThemedSelectTrigger;
