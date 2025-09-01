import { logoutUser } from "@/api/users/logout/Logout";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const { setUserId } = useSettingsStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      await logoutUser();
      setUserId("");
      navigate("/");
    }
    logout();
  }, [navigate, setUserId]);

  return <div className="hidden" />;
}
