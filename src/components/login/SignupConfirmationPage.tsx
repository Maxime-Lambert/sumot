import { resendConfirmation } from "@/api/users/resendConfirmation/ResendConfirmation";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, RefreshCw } from "lucide-react";
import { ThemedButton } from "../ui/themed/button";
import { showToast } from "@/services/ToastService";

export default function SignupConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  async function handleResend(email: string) {
    await resendConfirmation({
      email,
      frontEndName: 0,
    });
    showToast("Email renvoyé !", "success");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary-container border border-primary-container-border text-primary-container-foreground rounded shadow text-center">
      {email ? (
        <>
          <h2 className="text-xl font-bold mb-4">Confirmation requise</h2>
          <p className="mb-6">
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            Veuillez vérifier votre boîte de réception pour activer votre
            compte.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Compte créé</h2>
          <p className="mb-6">
            Votre compte a été créé avec succès. Vous pouvez maintenant vous
            connecter.
          </p>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {email && (
          <ThemedButton
            variant="outline"
            onClick={() => handleResend(email)}
            icon={RefreshCw}
          >
            Renvoyer l’email
          </ThemedButton>
        )}
        <ThemedButton onClick={() => navigate("/login")} icon={LogIn}>
          Se connecter
        </ThemedButton>
      </div>
    </div>
  );
}
