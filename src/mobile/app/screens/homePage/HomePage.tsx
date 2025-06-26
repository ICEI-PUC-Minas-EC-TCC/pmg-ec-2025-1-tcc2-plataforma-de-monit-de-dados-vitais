import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logout } from "../../firebase/auth";
import { useLocationUpdate } from "../../hooks/useLocationUpdate";
import { useRealtimeData } from "../../hooks/useRealtimeData";
import { getGlobalUID } from "../login/globalVariables";
import { fetchUserData, UserData } from "./homeScript";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Activities: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomePage() {
  const navigation = useNavigation<NavigationProp>();
  const userId = getGlobalUID();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { healthData, loading, error } = useRealtimeData();

  // Usar os hooks de atualização
  useLocationUpdate();

  useEffect(() => {
    const loadUserData = async () => {
      if (userId) {
        try {
          const data = await fetchUserData(userId);
          setUserData(data);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };

    loadUserData();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
    }
  };

  const handleEmergency = async () => {
    try {
      const response = await fetch(
        "https://webhookbaleia.flowaitecnologia.shop/webhook/2879d902-3bd8-4f73-aed0-92b6f34377c3"
      );
      if (response.ok) {
        Alert.alert(
          "SOS Enviado",
          "Sua solicitação de emergência foi enviada com sucesso para os seus contatos."
        );
      } else {
        throw new Error("Falha ao enviar SOS");
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o SOS. Por favor, tente novamente ou ligue para o serviço de emergência diretamente."
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#A18AE6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {userData?.name || "Usuário"}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={handleEmergency}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>

      {/* Status Box */}
      <View style={styles.statusBox}>
        <MaterialCommunityIcons
          name={healthData.isConnected ? "wifi" : "wifi-off"}
          size={24}
          color={healthData.isConnected ? "#4CAF50" : "#FF5252"}
        />
        <Text style={styles.statusText}>
          {healthData.isConnected
            ? "HealthyBand conectada via Wi-fi"
            : "HealthyBand desconectada"}
        </Text>
        {healthData.isConnected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#4CAF50"
          />
        )}
      </View>

      {/* Main Health Card */}
      <View style={styles.healthCard}>
        <Text style={styles.cardTitle}>Batimentos cardíacos</Text>
        <Text style={styles.bpmValue}>{healthData.heartRate} bpm</Text>

        <View style={styles.divider} />

        <Text style={styles.cardTitle}>Nível de Oxigênio</Text>
        <Text style={styles.bpmValue}>{healthData.oxygenLevel}%</Text>
      </View>

      {/* Additional Vital Signs Card */}
      <View style={styles.healthCard}>
        <Text style={styles.cardTitle}>Dados Ambientais</Text>

        <View style={styles.indicatorsRow}>
          <View style={styles.indicator}>
            <MaterialCommunityIcons
              name="arrow-up-bold"
              size={20}
              color="#6B6B6B"
            />
            <Text style={styles.indicatorText}>{healthData.altitude}m</Text>
          </View>

          <View style={styles.indicator}>
            <MaterialCommunityIcons name="gauge" size={20} color="#6B6B6B" />
            <Text style={styles.indicatorText}>
              {healthData.atmosphericPressure}hPa
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E8FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    flex: 1,
    marginLeft: 10,
    color: "#222",
    fontSize: 16,
  },
  healthCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#6B6B6B",
    marginBottom: 10,
  },
  bpmValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },
  indicatorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicatorText: {
    marginLeft: 5,
    color: "#6B6B6B",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E6E8FA",
    marginVertical: 20,
  },
  sosButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  sosButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 16,
    textAlign: "center",
  },
});
