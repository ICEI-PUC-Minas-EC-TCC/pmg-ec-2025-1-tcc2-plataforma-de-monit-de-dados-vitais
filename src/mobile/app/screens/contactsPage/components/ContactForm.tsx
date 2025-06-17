import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ContactFormProps {
  onSubmit: (contact: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async () => {
    try {
      // Validar campos
      if (!formData.name || !formData.email || !formData.phone) {
        Alert.alert("Erro", "Por favor, preencha todos os campos");
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert("Erro", "Por favor, insira um email válido");
        return;
      }

      // Validar telefone (apenas números)
      const phoneRegex = /^\d+$/;
      if (!phoneRegex.test(formData.phone)) {
        Alert.alert("Erro", "O telefone deve conter apenas números");
        return;
      }

      await onSubmit({
        ...formData,
        phone: `+55${formData.phone}`,
      });

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
      Alert.alert("Erro", "Não foi possível adicionar o contato");
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Adicionar Contato de Confiança</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Digite o nome completo"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Digite o email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefone</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.phonePrefix}>+55</Text>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Digite o número"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Adicionar Contato</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phonePrefix: {
    fontSize: 16,
    marginRight: 8,
    color: "#333",
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
