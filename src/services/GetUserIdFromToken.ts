import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types/DecodedToken";

export function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.nameid;
  } catch (err) {
    console.error("Erreur de décodage du token", err);
    return null;
  }
}
