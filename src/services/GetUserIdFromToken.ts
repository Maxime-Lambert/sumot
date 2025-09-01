import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types/DecodedToken";

export function getUserIdFromToken(token: string): string | null {
  const decoded = jwtDecode<DecodedToken>(token);
  return decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ];
}

export function getUsernameFromToken(token: string): string | null {
  const decoded = jwtDecode<DecodedToken>(token);
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
}
