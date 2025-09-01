import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { rollbackChanges } from "@/api/users/rollback/RollbackChanges";

type Status = "loading" | "success" | "error";

export default function RollbackPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Lien invalide.");
      return;
    }

    const rollback = async () => {
      try {
        await rollbackChanges({ token });
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("Une erreur est survenue. Lien peut-être expiré.");
      }
    };

    void rollback();
  }, [searchParams]);

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 rounded-lg border border-primary-container-border bg-primary-container text-primary-container-foreground shadow space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Restauration des informations
      </h1>

      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 text-primary-container-muted">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Restauration en cours...</span>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center justify-center gap-2 text-primary-container-foreground">
          <CheckCircle2 className="w-6 h-6" />
          <span>Vos informations ont bien été restaurées.</span>
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
