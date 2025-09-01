import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemedInput from "@/components/ui/themed/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/api/users/forgotPassword/ForgotPassword";
import { showToast } from "@/services/ToastService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email, frontEndName: 0 });
      showToast(
        "Si l’adresse existe dans notre base et a bien été vérifiée, vous recevrez un email avec les instructions.",
        "success"
      );
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary-container border border-primary-container-border text-primary-container-foreground rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">
        Réinitialisation du mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ThemedInput
          id="email"
          type="email"
          label="Adresse e-mail"
          placeholder="exemple@domaine.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Envoi en cours...
            </span>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Button>
      </div>
    </div>
  );
}
