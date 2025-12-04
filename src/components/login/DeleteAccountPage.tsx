import { Button } from "@/components/ui/button";
import ThemedInput from "@/components/ui/themed/input";
import { deleteUser } from "@/api/users/deleteUser/DeleteUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { loginUser } from "@/api/users/loginUser/LoginUser";
import { getUserIdFromToken } from "@/services/GetUserIdFromToken";
import { flushBufferedHistoriesIfAny } from "@/services/SumotHistoryStorage";
import { useSettingsStore } from "@/hooks/useSettingStore";

export default function DeleteAccountPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const { setUserId } = useSettingsStore();

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-primary-container border border-primary-container-border text-primary-container-foreground rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Supprimer mon compte
        </h2>

        <p className="text-sm text-primary-container-muted">
          Pour pouvoir supprimer votre compte, vous devez d'abord être connecté.
        </p>

        <form
          onSubmit={handleLogin}
          className="max-w-2xl mx-auto mt-4 bg-primary-container text-primary-container-foreground border border-primary-container-border rounded p-8 space-y-6 shadow"
        >
          <h2 className="text-3xl font-bold text-center">Connexion</h2>

          <div className="space-y-4">
            <ThemedInput
              id="userName"
              placeholder="JohnDoe38"
              label="Nom d'utilisateur"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
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
        </form>
      </div>
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    await deleteUser({ password });
    navigate("/logout");
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({
        userName: userName,
        password,
        ipAdress: "127.0.0.1",
      });
      if (response.status === 200) {
        const token = localStorage.getItem("access_token");
        const userId = getUserIdFromToken(token!);
        await flushBufferedHistoriesIfAny();
        setUserId(userId!);
      }
    } finally {
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary-container border border-primary-container-border text-primary-container-foreground rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">
        Supprimer mon compte
      </h2>

      <p className="text-sm text-primary-container-muted mb-1">
        Cette action est <strong>définitive</strong> et entraînera la perte de
        toutes vos données. Pour confirmer, entrez votre mot de passe.
      </p>

      <ThemedInput
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex flex-col items-center mt-4 gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
          className="w-full sm:w-auto center bg-primary-container-error hover:bg-primary-container-error/80"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Supprimer
        </Button>
      </div>
    </div>
  );
}
