import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../services/GetUserIdFromToken";
import type { PatchUserRequest } from "../api/users/patchUser/PatchUserRequest";
import { ColorBlindMode } from "../types/enums/ColorBlindModeEnum";
import { KeyboardLayouts } from "../types/enums/KeyboardLayoutsEnum";
import { SmartKeyboardType } from "../types/enums/KeyboardTypeEnum";
import { getUser } from "../api/users/getUser/GetUser";
import { patchUser } from "../api/users/patchUser/PatchUser";

export default function AccountPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<PatchUserRequest>({
    username: "",
    email: "",
    password: "",
    lastpassword: "",
    colorblindmode: ColorBlindMode.NONE,
    keyboardlayout: KeyboardLayouts.AZERTY,
    smartkeyboardtype: SmartKeyboardType.NONE,
  });
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        navigate("/login");
        return;
      }

      setUserId(userId);
      const user = await getUser(userId);
      setUser({
        username: user.userName,
        email: user.email,
        lastpassword: "",
        password: "",
        colorblindmode: user.colorblindMode,
        keyboardlayout: user.keyboardLayout,
        smartkeyboardtype: user.smartKeyboardType,
      });
      setLoading(false);
    };

    fetchUser();
  }, [navigate, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patchUser(user, userId);
      alert("Modifications enregistrées.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-surface text-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Mon compte ALED
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="Pseudo"
          className="w-full bg-primary px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full bg-primary px-3 py-2 rounded"
        />
        <input
          type="password"
          name="LastPassword"
          value={user.lastpassword}
          onChange={handleChange}
          placeholder="Ancien mot de passe"
          className="w-full bg-primary px-3 py-2 rounded"
        />
        <input
          type="password"
          name="Password"
          value={user.password}
          onChange={handleChange}
          placeholder="Nouveau mot de passe"
          className="w-full bg-primary px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-correct py-2 rounded hover:opacity-90"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
