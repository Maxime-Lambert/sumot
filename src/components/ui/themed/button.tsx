import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ThemedButtonProps = {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Button>;

export function ThemedButton({
  icon: Icon,
  iconPosition = "left",
  children,
  className,
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      {...props}
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
    </Button>
  );
}
