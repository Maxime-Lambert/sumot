import { BadgeCheck, XCircle, Info } from "lucide-react";
import { toast } from "sonner";
import React from "react";

type ToastType = "success" | "error" | "info";

const toastConfig: Record<
  ToastType,
  { bg: string; icon: React.ReactNode; duration: number }
> = {
  success: {
    bg: "bg-primary text-primary-foreground border border-primary-container-border",
    icon: <BadgeCheck className="w-5 h-5 text-primary-foreground" />,
    duration: 3000,
  },
  error: {
    bg: "bg-error text-error-foreground border border-error-container-border",
    icon: <XCircle className="w-5 h-5 text-error-foreground" />,
    duration: 5000,
  },
  info: {
    bg: "bg-secondary text-secondary-foreground border border-secondary-container-border",
    icon: <Info className="w-5 h-5 text-secondary-foreground" />,
    duration: 3000,
  },
};

export function showToast(message: string, type: ToastType = "info") {
  const { bg, icon, duration } = toastConfig[type];

  toast.custom(
    () => (
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow-md border ${bg}`}
      >
        {icon}
        <span className="text-sm">{message}</span>
      </div>
    ),
    {
      duration,
      position: "top-right",
    }
  );
}
