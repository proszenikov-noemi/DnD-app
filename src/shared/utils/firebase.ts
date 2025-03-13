import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAy37pkUzDsYqDvgIsNSl1SXyTWVhZd_9Q",
    authDomain: "laughing-shadows.firebaseapp.com",
    projectId: "laughing-shadows",
    storageBucket: "laughing-shadows.appspot.com",
    messagingSenderId: "938713433314",
    appId: "1:938713433314:web:4bcf8c006fe781acac0abb"
};

const app = initializeApp(firebaseConfig);

// 🔥 Firestore helyi cache beállítása az új ajánlott módon
const db = initializeFirestore(app, {
    localCache: persistentLocalCache()
});

const auth = getAuth(app);

export { db, auth };