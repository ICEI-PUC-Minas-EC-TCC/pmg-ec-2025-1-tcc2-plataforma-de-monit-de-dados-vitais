import { getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

interface HealthData {
  heartRate: number;
  temperature: number;
  oxygenLevel: number;
  isConnected: boolean;
  lastUpdate: string;
  altitude: number;
  atmosphericPressure: number;
}

export function useRealtimeData() {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 0,
    temperature: 0,
    oxygenLevel: 0,
    isConnected: false,
    lastUpdate: "",
    altitude: 0,
    atmosphericPressure: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const vitalSignsRef = ref(db, "Dados_vitais");

    // Configurar listener para dados em tempo real
    const unsubscribe = onValue(
      vitalSignsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            setHealthData({
              heartRate: data.bpm || 0,
              temperature: 0, // Não disponível nos dados atuais
              oxygenLevel: data.oxigenacao || 0,
              isConnected: true,
              lastUpdate: new Date().toISOString(),
              altitude: data.altitude || 0,
              atmosphericPressure: data.pressao_atmosferica || 0,
            });
          }
          setLoading(false);
        } catch (err) {
          setError("Erro ao carregar dados");
          setLoading(false);
        }
      },
      (error) => {
        setError("Erro na conexão com o banco de dados");
        setLoading(false);
      }
    );

    // Limpar listener quando o componente desmontar
    return () => {
      off(vitalSignsRef);
    };
  }, []);

  return { healthData, loading, error };
}
