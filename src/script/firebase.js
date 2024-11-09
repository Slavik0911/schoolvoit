// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD18OiMrP8CqXKprtxnUGjf-TBhN1jLGKQ",
  authDomain: "voiting-d2e1c.firebaseapp.com",
  projectId: "voiting-d2e1c",
  storageBucket: "voiting-d2e1c.firebasestorage.app",
  messagingSenderId: "178962638405",
  appId: "1:178962638405:web:6fc9f5151f8ef0c785652c"
};

// Initialization Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);

export { firestore, database };
