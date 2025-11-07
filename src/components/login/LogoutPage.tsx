import { logoutUser } from "@/api/users/logout/Logout";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const { setUserId } = useSettingsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      navigate("/");
      return;
    }
    async function logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expires");
      setUserId("");
      await logoutUser();
      navigate("/");
    }
    logout();
  }, [navigate, setUserId]);

  return <div className="hidden" />;
}
