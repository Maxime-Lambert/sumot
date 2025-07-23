import { HelpCircle, Settings } from "lucide-react";

type HeaderProps = {
  onOpenHelp: () => void;
  onOpenSettings: () => void;
};

export default function Header({ onOpenHelp, onOpenSettings }: HeaderProps) {
  return (
    <header className="w-full border-b border-accent bg-surface shadow">
      <div className="max-w-4xl mx-auto relative flex items-center justify-between px-4 py-3">
        <div className="w-14" />
        <div className="absolute left-1/2 -translate-x-1/2">
          <img
            src="/sumot_logo_cropped.png"
            alt="SUMOT Logo"
            className="h-14 object-contain"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenHelp}>
            <HelpCircle
              size={16}
              className="w-8 h-8 text-white hover:opacity-90 transition"
            />
          </button>
          <button onClick={onOpenSettings}>
            <Settings
              size={16}
              className="w-8 h-8 text-white hover:opacity-90 transition"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
