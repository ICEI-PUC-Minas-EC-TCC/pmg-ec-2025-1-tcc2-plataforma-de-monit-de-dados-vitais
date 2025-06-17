import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../firebase/config";
import { getGlobalUID } from "../login/globalVariables";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photoURL: string;
  height: number;
  weight: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = getGlobalUID();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData({ uid: userId, ...userDoc.data() } as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A18AE6" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Não foi possível carregar os dados do perfil
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: userData.photoURL || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="account" size={24} color="#A18AE6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Idade</Text>
            <Text style={styles.infoValue}>{userData.age} anos</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="ruler" size={24} color="#A18AE6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{userData.height} cm</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="weight" size={24} color="#A18AE6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{userData.weight} kg</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.sectionTitle}>Biografia</Text>
        <Text style={styles.bioText}>{userData.bio}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    padding: 15,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  bioSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#FF5252",
    textAlign: "center",
    marginTop: 20,
  },
});
