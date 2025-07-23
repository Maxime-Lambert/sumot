// src/pages/LoginPage.tsx
import { useState } from "react";
import axios from "../api/axios";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post("/users/login", {
        userName: username,
        password: password,
        ipAddress: "127.0.0.1", // à adapter
      });
      localStorage.setItem("access_token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      alert("Erreur d’authentification" + err);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-24 bg-surface p-6 rounded shadow"
    >
      <h2 className="text-2xl mb-4 text-center">Connexion</h2>
      <input
        className="w-full p-2 mb-4 bg-gray-800 rounded"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full p-2 mb-4 bg-gray-800 rounded"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full p-2 bg-blue-600 hover:bg-blue-500 rounded">
        Se connecter
      </button>
    </form>
  );
};
