import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  clearLoginCredentials,
  getLoginCredentials,
  saveLoginCredentials,
} from "../../firebase/sharedPreferences";
import { setGlobalUID } from "./globalVariables";
import { loginWithEmailAndPassword } from "./loginScript";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomNavigation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    checkSavedCredentials();
  }, []);

  const checkSavedCredentials = async () => {
    const credentials = await getLoginCredentials();
    if (credentials) {
      setEmail(credentials.email || "");
      setPassword(credentials.password || "");
      setKeepLoggedIn(true);
      handleLogin(credentials.email || "", credentials.password || "");
    }
  };

  const handleLogin = async (emailToUse = email, passwordToUse = password) => {
    if (!emailToUse || !passwordToUse) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const user = await loginWithEmailAndPassword(emailToUse, passwordToUse);
      setGlobalUID(user.uid);

      if (keepLoggedIn) {
        await saveLoginCredentials(emailToUse, passwordToUse);
      } else {
        await clearLoginCredentials();
      }

      navigation.navigate("BottomNavigation");
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Email ou senha incorretos";
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TCC Monitor</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.rememberMe}>
          <Switch
            value={keepLoggedIn}
            onValueChange={setKeepLoggedIn}
            trackColor={{ false: "#767577", true: "#A18AE6" }}
            thumbColor={keepLoggedIn ? "#6B4EFF" : "#f4f3f4"}
          />
          <Text style={styles.rememberMeText}>Manter conectado</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLogin()}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rememberMeText: {
    color: "#666",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#6B4EFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6B4EFF",
  },
  registerButtonText: {
    color: "#6B4EFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
