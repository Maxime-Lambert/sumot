import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createUser } from "@/api/users/createUser/CreateUser";
import ThemedInput from "@/components/ui/themed/input";
import CguModal from "@/components/application/modals/CguModal";
import PrivacyPolicyModal from "@/components/application/modals/PrivacyPolicyModal";
import type { CreateUserRequest } from "@/api/users/createUser/CreateUserRequest";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "@/services/ToastService";
import { AxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info } from "lucide-react";

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [openCgu, setOpenCgu] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule.";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre.";
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un caractère spécial.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.consent) {
      showToast(
        "Vous devez accepter les CGU et la politique de confidentialité.",
        "error"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    const pwdError = validatePassword(form.password);
    if (pwdError) {
      showToast(pwdError, "error");
      return;
    }

    setLoading(true);

    try {
      const createUserRequest: CreateUserRequest = {
        username: form.userName,
        password: form.password,
        ...(form.email && { email: form.email }),
      };

      const response = await createUser(createUserRequest);

      if (response.status === 201) {
        if (form.email) {
          navigate("/signup", { state: { email: form.email } });
        } else {
          navigate("/login");
        }
        return;
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          showToast(data.detail || "Requête invalide.", "error");
        }
      } else {
        showToast("Erreur inconnue", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-4 bg-primary-container text-primary-container-foreground border border-primary-container-border rounded p-6 space-y-4 shadow relative"
      >
        <h2 className="text-xl font-bold text-center">Créer un compte</h2>

        <ThemedInput
          id="userName"
          name="userName"
          label="Nom d'utilisateur"
          placeholder="JonhDoe38"
          value={form.userName}
          onChange={handleChange}
          required
          tooltip={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-primary-container-foreground">
                    <Info />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className="bg-primary-container text-primary-container-foreground max-w-xs break-words"
                >
                  <p>Seulement lettres et chiffres</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        />

        <ThemedInput
          id="password"
          type="password"
          name="password"
          label="Mot de passe"
          placeholder="************"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading}
          tooltip={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-primary-container-foreground">
                    <Info />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className="bg-primary-container text-primary-container-foreground max-w-xs break-words"
                >
                  <ul className="list-disc list-inside text-sm">
                    <li>6 à 20 caractères</li>
                    <li>Au moins une majuscule</li>
                    <li>Au moins une minuscule</li>
                    <li>Au moins un chiffre</li>
                    <li>Au moins un caractère spécial</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        />

        <ThemedInput
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          label="Confirmation du mot de passe"
          placeholder="************"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <ThemedInput
          id="email"
          type="email"
          name="email"
          label="Adresse email (optionnel)"
          placeholder="JohnDoe_38@domain.com"
          value={form.email}
          onChange={handleChange}
          pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
          description="L’email permet la récupération de compte."
          disabled={loading}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            className="accent-primary"
            disabled={loading}
          />
          <span>
            J'accepte les{" "}
            <button
              type="button"
              onClick={() => setOpenCgu(true)}
              className="underline text-primary-container-foreground hover:text-primary-container-foreground/80"
              disabled={loading}
            >
              CGU
            </button>{" "}
            et la{" "}
            <button
              type="button"
              onClick={() => setOpenPrivacyPolicy(true)}
              className="underline text-primary-container-foreground hover:text-primary-container-foreground/80"
              disabled={loading}
            >
              Politique de confidentialité
            </button>
            .
          </span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Création..." : "Créer le compte"}
        </Button>

        <p className="text-sm text-center text-secondary-muted">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="underline text-primary hover:text-primary/80"
          >
            Connectez-vous ici !
          </Link>
        </p>

        <CguModal isOpen={openCgu} onClose={() => setOpenCgu(false)} />
        <PrivacyPolicyModal
          isOpen={openPrivacyPolicy}
          onClose={() => setOpenPrivacyPolicy(false)}
        />

        {loading && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-auto flex items-center justify-center rounded">
            <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
      </form>
    </div>
  );
}
