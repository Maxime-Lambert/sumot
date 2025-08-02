import { useEffect, useState } from "react";
import { loginUser } from "../api/users/loginUser/LoginUser";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      window.location.href = "/";
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await loginUser({ username, password, ipAdress: "127.0.0.1" });
      window.location.href = "/";
    } catch (err) {
      alert("Erreur d’authentification : " + err);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-24 bg-surface p-6 rounded shadow"
    >
      <h2 className="text-2xl mb-4 text-center">Connexion au compte ALED</h2>
      <input
        className="w-full p-2 mb-4 bg-primary text-white rounded"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full p-2 mb-4 bg-primary text-white rounded"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full p-2 bg-correct hover:opacity-90 rounded">
        Se connecter
      </button>
    </form>
  );
};
