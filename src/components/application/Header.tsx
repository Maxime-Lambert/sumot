import { useState, useRef } from "react";
import { HelpCircle, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onOpenHelp: () => void;
  onOpenSettings: () => void;
};

export default function Header({ onOpenHelp, onOpenSettings }: HeaderProps) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access_token");
  const [showMenu, setShowMenu] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  }

  function handleMouseEnter() {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setShowMenu(true);
  }

  function handleMouseLeave() {
    closeTimeout.current = setTimeout(() => {
      setShowMenu(false);
      closeTimeout.current = null;
    }, 300);
  }

  return (
    <header className="w-full border-b border-accent bg-surface shadow">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="w-14" />
        <div className="flex-1 flex justify-center">
          <button onClick={() => navigate("/")}>
            <img
              src="/sumot_logo_cropped.png"
              alt="SUMOT Logo"
              className="h-14 object-contain"
            />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenHelp} aria-label="Aide">
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

          {/* Bloc utilisateur avec hover + délai */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="cursor-pointer">
              <User
                size={16}
                className="w-8 h-8 text-white hover:opacity-90 transition"
              />
            </div>

            {showMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-surface border rounded shadow-lg
                transition-all duration-150 z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate("/account")}
                      className="w-full text-left px-4 py-2 hover:bg-primary"
                    >
                      Gestion du compte
                    </button>
                    <button
                      onClick={() => navigate("/friends")}
                      className="w-full text-left px-4 py-2 hover:bg-primary"
                    >
                      Amis
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-primary"
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-left px-4 py-2 hover:bg-primary"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full text-left px-4 py-2 hover:bg-primary"
                    >
                      Créer un compte
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
