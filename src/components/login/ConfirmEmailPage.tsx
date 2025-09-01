import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { confirmEmail } from "@/api/users/confirmEmail/ConfirmEmail";

type Status = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Lien de confirmation invalide.");
      return;
    }

    const confirm = async () => {
      try {
        await confirmEmail({ token });
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
            setErrorMessage("Lien expiré ou déjà utilisé.");
          } else {
            setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
          }
        } else {
          setErrorMessage("Erreur inconnue.");
        }
      }
    };

    void confirm();
  }, [searchParams]);

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 rounded-lg border border-primary-container-border bg-primary-container text-primary-container-foreground shadow space-y-6">
      <h1 className="text-2xl font-bold text-center">Confirmation d’email</h1>

      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 text-primary-container-muted">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Confirmation en cours...</span>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-primary-container-foreground">
            <CheckCircle2 className="w-6 h-6" />
            <span>Votre adresse e-mail a bien été confirmée.</span>
          </div>
          <p className="text-sm text-primary-container-muted">
            Redirection vers la page de connexion dans {countdown} seconde
            {countdown > 1 ? "s" : ""}...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center justify-center gap-2 text-primary-container-error">
          <XCircle className="w-6 h-6" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
