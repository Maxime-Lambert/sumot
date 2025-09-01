import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ThemedInputProps = {
  label?: string;
  id?: string;
  required?: boolean;
  description?: string;
  tooltip?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Input>;

const ThemedInput = React.forwardRef<HTMLInputElement, ThemedInputProps>(
  ({ label, id, description, className, tooltip, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && id && (
          <label
            htmlFor={id}
            className="text-sm font-medium flex items-center gap-1"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Input
              id={id}
              ref={ref}
              className={cn(
                "w-full bg-secondary-container text-secondary-container-foreground placeholder:text-secondary-muted focus:outline-none focus:ring-1 focus:ring-primary",
                className
              )}
              {...props}
            />
            {tooltip && (
              <div className="absolute right-2 flex items-center">
                {tooltip}
              </div>
            )}
          </div>
        </div>

        {description && (
          <small className="text-sm text-primary-container-muted">
            {description}
          </small>
        )}
      </div>
    );
  }
);

ThemedInput.displayName = "ThemedInput";

export default ThemedInput;
