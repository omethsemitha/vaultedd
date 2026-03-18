import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzPOBh7SmCKOmzw4-9JT0ufRDRHFOURMI",
  authDomain: "vaultedd-f6a23.firebaseapp.com",
  projectId: "vaultedd-f6a23",
  storageBucket: "vaultedd-f6a23.firebasestorage.app",
  messagingSenderId: "335983315883",
  appId: "1:335983315883:web:59e3f98f8046ce3db0a0ee"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
