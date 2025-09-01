import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/api/users/loginUser/LoginUser";
import ThemedInput from "@/components/ui/themed/input";
import { LogIn, Loader2 } from "lucide-react";
import { flushBufferedHistoriesIfAny } from "@/services/SumotHistoryStorage";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { getUserIdFromToken } from "@/services/GetUserIdFromToken";
import { patchUser } from "@/api/users/patchUser/PatchUser";
import { ColorBlindModeApiMap } from "@/types/enums/ColorBlindModeEnum";
import { KeyboardLayoutsApiMap } from "@/types/enums/KeyboardLayoutsEnum";
import { SmartKeyboardTypeApiMap } from "@/types/enums/KeyboardTypeEnum";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colorblindMode, keyboardLayout, keyboardType, setUserId } =
    useSettingsStore();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({
        username,
        password,
        ipAdress: "127.0.0.1",
      });
      if (response.status === 200) {
        const token = localStorage.getItem("access_token");
        const userId = getUserIdFromToken(token!);
        await flushBufferedHistoriesIfAny();
        setUserId(userId!);
        await patchUser(
          {
            colorblindmode: ColorBlindModeApiMap[colorblindMode],
            keyboardlayout: KeyboardLayoutsApiMap[keyboardLayout],
            smartkeyboardtype: SmartKeyboardTypeApiMap[keyboardType],
          },
          userId!
        );
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-2xl mx-auto mt-4 bg-primary-container text-primary-container-foreground border border-primary-container-border rounded p-8 space-y-6 shadow"
    >
      <h2 className="text-3xl font-bold text-center">Connexion</h2>

      <div className="space-y-4">
        <ThemedInput
          id="username"
          placeholder="JohnDoe38"
          label="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="text-right text-sm">
          <button
            type="button"
            onClick={() => navigate("/forgotusername")}
            className="text-primary-container-muted underline hover:text-primary-container-muted/80"
          >
            Nom d'utilisateur oublié ?
          </button>
        </div>

        <ThemedInput
          id="password"
          type="password"
          label="Mot de passe"
          placeholder="************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="text-right text-sm">
          <button
            type="button"
            onClick={() => navigate("/forgotpassword")}
            className="text-primary-container-muted underline hover:text-primary-container-muted/80"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
            Connexion en cours...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </>
        )}
      </Button>

      <p className="text-sm text-center text-secondary-muted">
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          className="underline text-primary hover:text-primary/80"
        >
          Créez-en un ici !
        </Link>
      </p>
    </form>
  );
};
