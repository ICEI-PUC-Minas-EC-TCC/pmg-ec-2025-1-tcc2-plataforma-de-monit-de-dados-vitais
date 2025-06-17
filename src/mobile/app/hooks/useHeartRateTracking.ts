import { getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

interface VitalSignsData {
  max: number;
  min: number;
  values: number[];
}

interface HealthData {
  heartRate: VitalSignsData;
  oxygenLevel: VitalSignsData;
}

export function useHeartRateTracking() {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: {
      max: 0,
      min: 0,
      values: [],
    },
    oxygenLevel: {
      max: 0,
      min: 0,
      values: [],
    },
  });

  useEffect(() => {
    const db = getDatabase();
    const vitalSignsRef = ref(db, "Dados_vitais");

    const unsubscribe = onValue(
      vitalSignsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            setHealthData((prev) => {
              const newHeartRateValues = data.bpm
                ? [...prev.heartRate.values, data.bpm]
                : prev.heartRate.values;
              const newOxygenValues = data.oxigenacao
                ? [...prev.oxygenLevel.values, data.oxigenacao]
                : prev.oxygenLevel.values;

              return {
                heartRate: {
                  max:
                    newHeartRateValues.length > 0
                      ? Math.max(...newHeartRateValues)
                      : 0,
                  min:
                    newHeartRateValues.length > 0
                      ? Math.min(...newHeartRateValues)
                      : 0,
                  values: newHeartRateValues,
                },
                oxygenLevel: {
                  max:
                    newOxygenValues.length > 0
                      ? Math.max(...newOxygenValues)
                      : 0,
                  min:
                    newOxygenValues.length > 0
                      ? Math.min(...newOxygenValues)
                      : 0,
                  values: newOxygenValues,
                },
              };
            });
          }
        } catch (err) {
          console.error("Erro ao processar dados vitais:", err);
        }
      },
      (error) => {
        console.error("Erro na conexão com o banco de dados:", error);
      }
    );

    return () => {
      off(vitalSignsRef);
    };
  }, []);

  const getAverageHeartRate = () => {
    if (healthData.heartRate.values.length === 0) return 0;
    const sum = healthData.heartRate.values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / healthData.heartRate.values.length);
  };

  const getAverageOxygenLevel = () => {
    if (healthData.oxygenLevel.values.length === 0) return 0;
    const sum = healthData.oxygenLevel.values.reduce(
      (acc, val) => acc + val,
      0
    );
    return Math.round(sum / healthData.oxygenLevel.values.length);
  };

  const resetHealthData = () => {
    setHealthData({
      heartRate: {
        max: 0,
        min: 0,
        values: [],
      },
      oxygenLevel: {
        max: 0,
        min: 0,
        values: [],
      },
    });
  };

  return {
    healthData,
    getAverageHeartRate,
    getAverageOxygenLevel,
    resetHealthData,
  };
}
