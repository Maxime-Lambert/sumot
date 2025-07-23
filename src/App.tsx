import { useState } from "react";
import "./App.css";
import Footer from "./components/application/Footer";
import Header from "./components/application/Header";
import Sumot from "./components/game/Sumot";
import HowToPlayModal from "./components/application/modals/HowToPlayModal";
import SettingsModal from "./components/application/modals/SettingsModal";
import {
  KeyboardLayouts,
  type KeyboardLayoutsEnum,
} from "./types/enums/KeyboardLayoutsEnum";
import {
  ColorBlindMode,
  type ColorBlindModeEnum,
} from "./types/enums/ColorBlindModeEnum";
import Layout from "./components/application/Layout";
import {
  KeyboardType,
  type KeyboardTypeEnum,
} from "./types/enums/KeyboardTypeEnum";

export default function App() {
  const [howToPlayModalOpen, setHowToPlayModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayoutsEnum>(
    KeyboardLayouts.AZERTY
  );
  const [colorblindMode, setColorBlindMode] = useState<ColorBlindModeEnum>(
    ColorBlindMode.NONE
  );
  const [keyboardType, setKeyboardType] = useState<KeyboardTypeEnum>(
    KeyboardType.CORRECTION
  );

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
      <Sumot
        colorblindMode={colorblindMode}
        layoutType={keyboardLayout}
        keyboardType={keyboardType}
      />
      <HowToPlayModal
        isOpen={howToPlayModalOpen}
        onClose={() => setHowToPlayModalOpen(false)}
        colorblindMode={colorblindMode}
      />
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        layoutType={keyboardLayout}
        onLayoutChange={(layout) => setKeyboardLayout(layout)}
        colorblindMode={colorblindMode}
        onColorBlindChange={(mode) => setColorBlindMode(mode)}
        keyboardType={keyboardType}
        onKeyboardTypeChange={(mode) => setKeyboardType(mode)}
      />
    </Layout>
  );
}
