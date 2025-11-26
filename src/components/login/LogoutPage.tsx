import { logoutUser } from "@/api/users/logout/Logout";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const { setUserId } = useSettingsStore();
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (localStorage.getItem("access_token") === null) {
      navigate("/", { replace: true });
    }

    (async () => {
      await logoutUser();
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expires");
      setUserId("");
      navigate("/", { replace: true });
    })();
  }, [navigate, setUserId]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 text-primary-container-foreground">
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Déconnexion...</span>
      </div>
    </div>
  );
}
