import { createUser } from "@/api/users/createUser/CreateUser";
import React, { useState } from "react";

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.consent) {
      setError(
        "Vous devez accepter les CGU et la politique de confidentialité."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await createUser({
        email: form.email,
        password: form.password,
        username: form.userName,
      });

      if (response.status === 201) {
        setSuccess(true);
        setForm({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
          consent: false,
        });
      } else {
        const errorText = response.statusText;
        setError(errorText || "Erreur inconnue.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border border-accent bg-surface rounded space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Créer un compte</h2>

      {error && <div className="text-wrong">{error}</div>}
      {success && (
        <div className="text-correct">Utilisateur créé avec succès !</div>
      )}

      <input
        type="text"
        name="userName"
        placeholder="Nom d'utilisateur"
        value={form.userName}
        onChange={handleChange}
        required
        className="w-full bg-primary px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-correct focus:border-correct"
      />

      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full bg-primary px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-correct focus:border-correct"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmation du mot de passe"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        className="w-full bg-primary px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-correct focus:border-correct"
      />

      <input
        type="email"
        name="email"
        placeholder="Email (optionnel)"
        value={form.email}
        onChange={handleChange}
        className="w-full bg-primary px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-correct focus:border-correct"
        pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
      />
      <small className="text-sm text-primary">
        L’email est optionnel mais requis pour la récupération de compte.
      </small>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="consent"
          checked={form.consent}
          onChange={handleChange}
          className="accent-blue-500"
        />
        <span>
          J'accepte les{" "}
          <a href="/cgu" className="underline">
            CGU
          </a>{" "}
          et la{" "}
          <a href="/politique" className="underline">
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-correct text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Création..." : "Créer le compte"}
      </button>
    </form>
  );
}
