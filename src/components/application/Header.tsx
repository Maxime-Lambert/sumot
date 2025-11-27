import {
  Calendar1,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import ThemedDropdownMenuContent from "../ui/themed/dropdownmenucontent";
import ThemedDropdownMenuItem from "../ui/themed/dropdownmenuitem";
import ThemedDropdownMenuTrigger from "../ui/themed/dropdownmenutrigger";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { Button } from "../ui/button";
import { useFriendRequestsStore } from "@/hooks/useFriendRequestsStore";

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export default function Header({ onOpenHelp, onOpenSettings }: HeaderProps) {
  const navigate = useNavigate();
  const { userId } = useSettingsStore();
  const { receivedCount } = useFriendRequestsStore();

  return (
    <header className="w-full h-12 sm:h-16 border-b border-secondary-border bg-secondary text-secondary-foreground backdrop-blur">
      <div className="max-w-[1280px] mx-auto flex items-center h-full justify-between px-3 sm:px-4">
        <div className="flex-1 flex justify-start" />

        <div className="flex-1 flex justify-center">
          <button onClick={() => navigate("/")} className="focus:outline-none">
            <img
              src="/sumot_logo_cropped.png"
              alt="SUMOT Logo"
              className="h-10 sm:h-14 object-contain"
            />
          </button>
        </div>

        <div className="flex-1 flex justify-end gap-2.5 sm:gap-3 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHelp}
            aria-label="Aide"
            className="w-4 h-4 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-secondary-muted rounded-md transition"
          >
            <HelpCircle className="!w-5 !h-5 sm:!w-7 sm:!h-7" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            aria-label="Paramètres"
            className="w-4 h-4 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-secondary-muted rounded-md transition"
          >
            <Settings className="!w-5 !h-5 sm:!w-7 sm:!h-7" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/history")}
            aria-label="Historique"
            className="w-4 h-4 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-secondary-muted rounded-md transition"
          >
            <Calendar1 className="!w-5 !h-5 sm:!w-7 sm:!h-7" />
          </Button>

          {userId && (
            <DropdownMenu>
              <ThemedDropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 sm:w-7 sm:h-7 p-0 items-center justify-center hover:bg-secondary-muted rounded-md transition inline-flex"
                >
                  <User className="!w-5 !h-5 sm:!w-7 sm:!h-7" />
                </Button>
              </ThemedDropdownMenuTrigger>
              <ThemedDropdownMenuContent
                side="bottom"
                align="end"
                className="w-56"
              >
                <ThemedDropdownMenuItem onClick={() => navigate("/account")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Gestion du compte
                </ThemedDropdownMenuItem>
                <ThemedDropdownMenuItem
                  className="bg-primary-container-error/70 hover:bg-primary-container-error focus:bg-primary-container-error"
                  onClick={() => navigate("/logout")}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </ThemedDropdownMenuItem>
              </ThemedDropdownMenuContent>
            </DropdownMenu>
          )}

          {!userId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")}
              aria-label="Connecter"
              className="relative w-4 h-4 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-secondary-muted rounded-md transition"
            >
              <User className="!w-5 !h-5 sm:!w-7 sm:!h-7" />
            </Button>
          )}

          {userId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/friends")}
              aria-label="Amis"
              className="relative w-4 h-4 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-secondary-muted rounded-md transition"
            >
              <Users className="!w-5 !h-5 sm:!w-7 sm:!h-7" />
              {receivedCount > 0 && (
                <span className="absolute -bottom-1 -right-1 text-[10px] sm:text-xs bg-primary text-white rounded-full px-[5px] py-[1px] shadow">
                  {receivedCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
