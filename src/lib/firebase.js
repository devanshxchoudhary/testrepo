import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "convo-space-b8a0f.firebaseapp.com",
  projectId: "convo-space-b8a0f",
  storageBucket: "convo-space-b8a0f.appspot.com",
  messagingSenderId: "843916434003",
  appId: "1:843916434003:web:435e98b3db5c5da60c84a6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()