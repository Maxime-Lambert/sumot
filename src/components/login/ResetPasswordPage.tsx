import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "@/api/users/resetPassword/ResetPassword";
import { AxiosError } from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import ThemedInput from "@/components/ui/themed/input";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Lien invalide.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await resetPassword({ token, password });
      setStatus("success");
    } catch (error: unknown) {
      setStatus("error");

      if (
        error &&
        typeof error === "object" &&
        "isAxiosError" in error &&
        (error as AxiosError).isAxiosError
      ) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) {
          setErrorMessage("Lien expiré, invalide ou déjà utilisé.");
        } else {
          setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        }
      } else {
        setErrorMessage("Erreur inconnue.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 rounded-lg border border-primary-container-border bg-primary-container text-primary-container-foreground shadow space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Réinitialiser le mot de passe
      </h1>

      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 text-primary-container-foreground">
          <CheckCircle2 className="w-6 h-6" />
          <span>Votre mot de passe a bien été mis à jour.</span>
        </div>
      ) : status === "error" ? (
        <div className="flex items-center justify-center gap-2 text-primary-container-error">
          <XCircle className="w-6 h-6" />
          <span>{errorMessage}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <ThemedInput
            type="password"
            label="Nouveau mot de passe"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                En cours...
              </span>
            ) : (
              "Réinitialiser"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
