// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqOe9V1Jr_yIHLNTT6fltrpGhavrn42Mk",
  authDomain: "vote-ab70a.firebaseapp.com",
  projectId: "vote-ab70a",
  storageBucket: "vote-ab70a.firebasestorage.app",
  messagingSenderId: "320451497958",
  appId: "1:320451497958:web:c8ae366408be4ecea75027"
};

// Initialization Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);

export { firestore, database };
