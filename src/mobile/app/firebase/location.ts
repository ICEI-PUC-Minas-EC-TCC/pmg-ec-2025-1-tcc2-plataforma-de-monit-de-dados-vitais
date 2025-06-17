import * as Location from "expo-location";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export async function updateUserLocation(userId: string) {
  try {
    // Solicitar permissão de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de localização negada");
      return;
    }

    // Obter localização atual
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Atualizar documento do usuário com a nova localização
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      },
    });

    console.log("Localização atualizada com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar localização:", error);
  }
}
