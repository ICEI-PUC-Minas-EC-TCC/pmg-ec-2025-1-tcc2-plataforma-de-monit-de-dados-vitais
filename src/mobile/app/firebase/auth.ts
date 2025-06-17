import { signOut } from "firebase/auth";
import { auth } from "./config";
import { clearLoginCredentials } from "./sharedPreferences";

export async function logout() {
  try {
    // Limpar credenciais salvas
    await clearLoginCredentials();

    // Fazer logout do Firebase
    await signOut(auth);

    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
}
