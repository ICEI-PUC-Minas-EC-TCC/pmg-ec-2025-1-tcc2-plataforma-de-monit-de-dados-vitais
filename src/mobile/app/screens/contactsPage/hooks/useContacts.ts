import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { Contact } from "../components/ContactCard";
import { ContactFormData } from "../components/ContactForm";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const contactsRef = collection(db, "contacts");
      const q = query(contactsRef, where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      const contactsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];

      setContacts(contactsList);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: ContactFormData) => {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado");
    }

    const contactsRef = collection(db, "contacts");
    await addDoc(contactsRef, {
      ...contactData,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
    });

    await loadContacts();
  };

  const deleteContact = async (contactId: string) => {
    await deleteDoc(doc(db, "contacts", contactId));
    await loadContacts();
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    addContact,
    deleteContact,
    refreshContacts: loadContacts,
  };
}
