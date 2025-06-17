import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { updateUserLocation } from "../../firebase/location";

export async function loginWithEmailAndPassword(
  email: string,
  password: string
) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Atualizar localização após login bem-sucedido
    await updateUserLocation(userCredential.user.uid);

    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}
