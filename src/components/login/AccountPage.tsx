import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "@/services/GetUserIdFromToken";
import type { PatchUserRequest } from "@/api/users/patchUser/PatchUserRequest";
import { getUser } from "@/api/users/getUser/GetUser";
import { patchUser } from "@/api/users/patchUser/PatchUser";
import { Button } from "@/components/ui/button";
import ThemedInput from "@/components/ui/themed/input";
import { Download, Edit, MoreVertical, Save, Trash2 } from "lucide-react";
import DeleteAccountModal from "./modals/DeleteAccountModal";
import { resendConfirmation } from "@/api/users/resendConfirmation/ResendConfirmation";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import ThemedDropdownMenuTrigger from "../ui/themed/dropdownmenutrigger";
import ThemedDropdownMenuContent from "../ui/themed/dropdownmenucontent";
import ThemedDropdownMenuItem from "../ui/themed/dropdownmenuitem";
import { ThemedButton } from "../ui/themed/button";
import { exportData } from "@/api/users/exportData/ExportData";
import { showToast } from "@/services/ToastService";
import LoadingScreen from "../game/LoadingScreen";
import { validatePassword } from "@/services/ValidatePassword";

export default function AccountPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [loading, setLoading] = useState(true);

  // Valeurs affichées / modifiables
  const [user, setUser] = useState<PatchUserRequest>({
    userName: "",
    email: "",
    lastPassword: "",
    newPassword: "",
  });

  // Valeurs initiales pour détecter les changements
  const [initialUser, setInitialUser] = useState<PatchUserRequest>({
    userName: "",
    email: "",
    lastPassword: "",
    newPassword: "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

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

      const u = await getUser();

      const loaded = {
        userName: u.userName,
        email: u.email,
        lastPassword: "",
        newPassword: "",
      };

      setUser(loaded);
      setInitialUser(loaded);
      setUserEmail(u.email);
      setEmailConfirmed(u.emailConfirmed);
      setLoading(false);
    };

    void fetchUser();
  }, [navigate, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user.newPassword) {
      const pwdError = validatePassword(user.newPassword);
      if (pwdError) {
        showToast(pwdError, "error");
        return;
      }
    }

    if (user.lastPassword) {
      const pwdError = validatePassword(user.lastPassword);
      if (pwdError) {
        showToast(pwdError, "error");
        return;
      }
    }

    const patch: Partial<PatchUserRequest> = {};

    const isPasswordEdited =
      user.lastPassword?.trim() !== "" || user.newPassword?.trim() !== "";

    if (isPasswordEdited) {
      patch.lastPassword = user.lastPassword;
      patch.newPassword = user.newPassword;
    }

    if (user.userName !== initialUser.userName) patch.userName = user.userName;

    if (user.email !== initialUser.email) patch.email = user.email;

    if (Object.keys(patch).length === 0) {
      showToast("Aucune modification détectée.", "info");
      setEditMode(false);
      return;
    }

    await patchUser(patch);

    showToast("Modifications enregistrées.", "success");
    setEditMode(false);

    setInitialUser({
      ...initialUser,
      ...patch,
      lastPassword: "",
      newPassword: "",
    });

    setUser((prev) => ({
      ...prev,
      lastPassword: "",
      newPassword: "",
    }));
  };

  if (loading) return <LoadingScreen />;

  const handleResend = async () => {
    await resendConfirmation({ email: userEmail, frontEndName: 0 });
  };

  const handleExport = async () => {
    await exportData();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md p-4 bg-primary-container text-primary-container-foreground border border-primary-container-border rounded space-y-4 shadow"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center">
          <button
            type="button"
            onClick={() => setEditMode((prev) => !prev)}
            className="p-1 flex items-center justify-center"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>

        <h1 className="flex-3 text-xl font-semibold text-center leading-none">
          Mon compte
        </h1>

        <div className="flex-1 flex items-center justify-end">
          <DropdownMenu>
            <ThemedDropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-auto w-auto p-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </ThemedDropdownMenuTrigger>

            <ThemedDropdownMenuContent
              side="right"
              align="end"
              className="w-56"
            >
              <ThemedDropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter mes données
              </ThemedDropdownMenuItem>

              <ThemedDropdownMenuItem
                className="bg-primary-container-error/70 focus:bg-primary-container-error hover:bg-primary-container-error"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer le compte
              </ThemedDropdownMenuItem>
            </ThemedDropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ThemedInput
        id="userName"
        name="userName"
        label="Nom d'utilisateur"
        value={user.userName}
        onChange={handleChange}
        disabled={!editMode}
      />

      <div className="flex flex-col gap-1">
        <ThemedInput
          id="email"
          name="email"
          type="email"
          label="Adresse e-mail"
          value={user.email}
          onChange={handleChange}
          disabled={!editMode}
        />

        {!emailConfirmed && userEmail && (
          <p className="text-xs text-primary-container-muted">
            Votre e-mail n'est pas vérifié.{" "}
            <button
              type="button"
              onClick={handleResend}
              className="underline hover:text-primary-container-muted/80"
            >
              Cliquez ici
            </button>{" "}
            pour renvoyer un code.
          </p>
        )}
      </div>

      {editMode && (
        <>
          <ThemedInput
            id="lastPassword"
            name="lastPassword"
            type="password"
            label="Ancien mot de passe"
            value={user.lastPassword}
            onChange={handleChange}
          />

          <ThemedInput
            id="newPassword"
            name="newPassword"
            type="password"
            label="Nouveau mot de passe"
            value={user.newPassword}
            onChange={handleChange}
          />
        </>
      )}

      {editMode && (
        <div className="flex sm:flex-row justify-end">
          <ThemedButton icon={Save} type="submit">
            Enregistrer
          </ThemedButton>
        </div>
      )}

      <DeleteAccountModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
      />
    </form>
  );
}
