import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAy37pkUzDsYqDvgIsNSl1SXyTWVhZd_9Q",
    authDomain: "laughing-shadows.firebaseapp.com",
    projectId: "laughing-shadows",
    storageBucket: "laughing-shadows.firebasestorage.app",
    messagingSenderId: "938713433314",
    appId: "1:938713433314:web:4bcf8c006fe781acac0abb"
  };


// Firebase inicializálás
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);