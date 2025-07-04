import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
  databaseURL: Constants.expoConfig?.extra?.FIREBASE_DATABASE_URL,
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID,
};

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth
export const auth = getAuth(app);

// Inicializa o Firestore
export const db = getFirestore(app);
