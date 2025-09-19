import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import App from "@/App";
import AccountPage from "@/components/login/AccountPage";
import FriendsPage from "@/components/login/FriendsPage";
import { LoginPage } from "@/components/login/LoginPage";
import CreateAccountPage from "@/components/login/CreateAccountPage";
import Layout from "./Layout";
import Header from "./Header";
import Footer from "./Footer";
import HowToPlayModal from "./modals/HowToPlayModal";
import SettingsModal from "./modals/SettingsModal";
import { Toaster } from "sonner";
import ConfirmEmailPage from "../login/ConfirmEmailPage";
import ResetPasswordPage from "../login/ResetPasswordPage";
import RollbackPage from "../login/RollbackPage";
import SignupConfirmationPage from "../login/SignupConfirmationPage";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { getUser } from "@/api/users/getUser/GetUser";
import { ColorBlindModes } from "@/types/enums/ColorBlindModeEnum";
import { SumotHistory } from "../game/SumotHistory";
import ForgotPasswordPage from "../login/ForgotPasswordPage";
import ForgotUsernamePage from "../login/ForgotUsernamePage";
import LogoutPage from "../login/LogoutPage";
import { useFriendRequestsStore } from "@/hooks/useFriendRequestsStore";

export default function AppWithLayout() {
  const [howToPlayModalOpen, setHowToPlayModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const {
    userId,
    colorblindMode,
    setColorblindMode,
    setKeyboardLayout,
    setKeyboardType,
  } = useSettingsStore();
  const { fetchFriendRequests } = useFriendRequestsStore();

  useEffect(() => {
    if (!userId) return;

    let id: ReturnType<typeof setInterval>;

    async function init() {
      const user = await getUser();
      setColorblindMode(user.colorblindMode);
      setKeyboardLayout(user.keyboardLayout);
      setKeyboardType(user.smartKeyboardType);
      await fetchFriendRequests(userId, true);
      id = setInterval(() => fetchFriendRequests(userId, false), 60000);
    }

    void init();

    return () => clearInterval(id);
  }, [
    userId,
    setColorblindMode,
    setKeyboardLayout,
    setKeyboardType,
    fetchFriendRequests,
  ]);

  useEffect(() => {
    document.documentElement.classList.remove("dark-colorblind");

    if (colorblindMode === ColorBlindModes.Active) {
      document.documentElement.classList.add("dark-colorblind");
    }
  }, [colorblindMode]);

  return (
    <Layout
      header={
        <Header
          onOpenHelp={() => setHowToPlayModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />
      }
      footer={<Footer />}
    >
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="/confirmemail" element={<ConfirmEmailPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/rollback" element={<RollbackPage />} />
        <Route path="/signup" element={<SignupConfirmationPage />} />
        <Route path="/history" element={<SumotHistory />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/forgotusername" element={<ForgotUsernamePage />} />
        <Route path="*" element={<div className="p-4">404 Not Found</div>} />
      </Routes>

      <HowToPlayModal
        isOpen={howToPlayModalOpen}
        onClose={() => setHowToPlayModalOpen(false)}
      />
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <Toaster offset={64} />
    </Layout>
  );
}
