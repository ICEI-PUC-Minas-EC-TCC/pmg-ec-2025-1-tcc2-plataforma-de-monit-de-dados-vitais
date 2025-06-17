import { useEffect } from "react";
import { updateUserLocation } from "../firebase/location";
import { getGlobalUID } from "../screens/login/globalVariables";

export function useLocationUpdate() {
  useEffect(() => {
    const userId = getGlobalUID();
    if (!userId) return;

    // Atualizar localização imediatamente
    updateUserLocation(userId);

    // Configurar intervalo para atualização periódica (a cada 5 minutos)
    const intervalId = setInterval(() => {
      updateUserLocation(userId);
    }, 5 * 60 * 1000);

    // Limpar intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, []);
}
