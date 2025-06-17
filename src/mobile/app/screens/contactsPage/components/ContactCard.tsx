import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => Promise<void>;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
}

export function ContactCard({ contact, onDelete }: ContactCardProps) {
  return (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactDetail}>{contact.email}</Text>
        <Text style={styles.contactDetail}>{contact.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(contact.id)}
      >
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 6,
    padding: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
