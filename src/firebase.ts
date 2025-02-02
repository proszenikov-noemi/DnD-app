import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 🔹 Storage importálása

const firebaseConfig = {
    apiKey: "AIzaSyAy37pkUzDsYqDvgIsNSl1SXyTWVhZd_9Q",
    authDomain: "laughing-shadows.firebaseapp.com",
    projectId: "laughing-shadows",
    storageBucket: "laughing-shadows.firebasestorage.app",
    messagingSenderId: "938713433314",
    appId: "1:938713433314:web:4bcf8c006fe781acac0abb"
  };


  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app); // 🔹 Storage inicializálása
  
  export { db, auth, storage }; // 🔹 Exportáljuk a Storage-ot is!