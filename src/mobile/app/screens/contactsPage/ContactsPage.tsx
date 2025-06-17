import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ContactCard } from "./components/ContactCard";
import { ContactForm, ContactFormData } from "./components/ContactForm";
import { useContacts } from "./hooks/useContacts";

export default function ContactsPage() {
  const { contacts, loading, addContact, deleteContact } = useContacts();

  const handleSubmit = async (contactData: ContactFormData) => {
    try {
      await addContact(contactData);
      Alert.alert("Sucesso", "Contato adicionado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o contato");
    }
  };

  const handleDelete = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      Alert.alert("Sucesso", "Contato removido com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o contato");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ContactForm onSubmit={handleSubmit} />

      <View style={styles.contactsList}>
        <Text style={styles.sectionTitle}>Contatos Salvos</Text>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDelete={handleDelete}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  contactsList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
});
