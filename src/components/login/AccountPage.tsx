import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "@/services/GetUserIdFromToken";
import type { PatchUserRequest } from "@/api/users/patchUser/PatchUserRequest";
import {
  ColorBlindModes,
  ColorBlindModeApiMap,
} from "@/types/enums/ColorBlindModeEnum";
import {
  KeyboardLayouts,
  KeyboardLayoutsApiMap,
} from "@/types/enums/KeyboardLayoutsEnum";
import {
  SmartKeyboardType,
  SmartKeyboardTypeApiMap,
} from "@/types/enums/KeyboardTypeEnum";
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

export default function AccountPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PatchUserRequest>({
    userName: "",
    email: "",
    password: "",
    lastpassword: "",
    colorblindmode: ColorBlindModeApiMap[ColorBlindModes.None],
    keyboardlayout: KeyboardLayoutsApiMap[KeyboardLayouts.AZERTY],
    smartkeyboardtype: SmartKeyboardTypeApiMap[SmartKeyboardType.None],
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
      const user = await getUser();
      setUser({
        userName: user.userName,
        email: user.email,
        lastpassword: "",
        password: "",
        colorblindmode: ColorBlindModeApiMap[user.colorblindMode],
        keyboardlayout: KeyboardLayoutsApiMap[user.keyboardLayout],
        smartkeyboardtype: SmartKeyboardTypeApiMap[user.smartKeyboardType],
      });
      setUserEmail(user.email);
      setEmailConfirmed(user.emailConfirmed);
      setLoading(false);
    };

    void fetchUser();
  }, [navigate, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patchUser(user);
    setEditMode(false);
    showToast("Modifications enregistrées.", "success");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  async function handleResend() {
    await resendConfirmation({
      email: userEmail,
      frontEndName: 0,
    });
  }

  async function handleExport() {
    await exportData();
  }

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
              <Button
                variant="ghost"
                size="icon"
                className="h-auto w-auto p-0 focus:border-none"
              >
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
          className="flex-grow"
          value={user.email}
          onChange={handleChange}
          disabled={!editMode}
        />

        {!emailConfirmed && (
          <p className="text-xs text-primary-container-muted">
            Votre e-mail n'est toujours pas vérifié. Si vous souhaitez renvoyer
            un nouveau code de vérification,{" "}
            <button
              type="button"
              onClick={handleResend}
              className="underline hover:text-primary-container-muted/80"
            >
              cliquez ici
            </button>
            .
          </p>
        )}
      </div>

      {editMode && (
        <>
          <ThemedInput
            id="lastpassword"
            name="lastpassword"
            type="password"
            label="Ancien mot de passe"
            value={user.lastpassword}
            onChange={handleChange}
            disabled={!editMode}
          />

          <ThemedInput
            id="password"
            name="password"
            type="password"
            label="Nouveau mot de passe"
            value={user.password}
            onChange={handleChange}
            disabled={!editMode}
          />
        </>
      )}

      {editMode && (
        <div className="flex sm:flex-row justify-end">
          <ThemedButton icon={Save} type="button" onClick={handleSubmit}>
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
