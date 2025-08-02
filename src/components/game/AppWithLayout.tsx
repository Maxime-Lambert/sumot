import App from "@/App";
import AccountPage from "@/login/AccountPage";
import FriendsPage from "@/login/FriendsPage";
import { LoginPage } from "@/login/LoginPage";
import {
  type ColorBlindModeEnum,
  ColorBlindMode,
} from "@/types/enums/ColorBlindModeEnum";
import {
  type KeyboardLayoutsEnum,
  KeyboardLayouts,
} from "@/types/enums/KeyboardLayoutsEnum";
import {
  type SmartKeyboardTypeEnum,
  SmartKeyboardType,
} from "@/types/enums/KeyboardTypeEnum";
import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "../application/Footer";
import Header from "../application/Header";
import HowToPlayModal from "../application/modals/HowToPlayModal";
import SettingsModal from "../application/modals/SettingsModal";
import Layout from "../application/Layout";
import { getUserIdFromToken } from "@/services/GetUserIdFromToken";
import { patchUser } from "@/api/users/patchUser/PatchUser";
import CreateAccountPage from "@/login/CreateAccountPage";

export function AppWithLayout() {
  const [howToPlayModalOpen, setHowToPlayModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayoutsEnum>(
    KeyboardLayouts.AZERTY
  );
  const [colorblindMode, setColorBlindMode] = useState<ColorBlindModeEnum>(
    ColorBlindMode.NONE
  );
  const [keyboardType, setKeyboardType] = useState<SmartKeyboardTypeEnum>(
    SmartKeyboardType.CORRECTION
  );
  const [userId, setUserId] = useState<string | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      const id = getUserIdFromToken(storedToken);
      if (id) setUserId(id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const patch = async () => {
      try {
        await patchUser(
          {
            keyboardlayout: keyboardLayout.toString(),
            colorblindmode: colorblindMode.toString(),
            smartkeyboardtype: keyboardType.toString(),
          },
          userId
        );
      } catch (err) {
        console.error("Échec mise à jour utilisateur :", err);
      }
    };

    patch();
  }, [keyboardLayout, colorblindMode, keyboardType, userId]);

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
        <Route
          path="/"
          element={
            <App
              layoutType={keyboardLayout}
              colorblindMode={colorblindMode}
              keyboardType={keyboardType}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="*" element={<div className="p-4">404 Not Found</div>} />
      </Routes>

      <HowToPlayModal
        isOpen={howToPlayModalOpen}
        onClose={() => setHowToPlayModalOpen(false)}
        colorblindMode={colorblindMode}
      />
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        layoutType={keyboardLayout}
        onLayoutChange={setKeyboardLayout}
        colorblindMode={colorblindMode}
        onColorBlindChange={setColorBlindMode}
        keyboardType={keyboardType}
        onKeyboardTypeChange={setKeyboardType}
      />

      <Toaster />
    </Layout>
  );
}
