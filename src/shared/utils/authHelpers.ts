import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

// Bejelentkezés felhasználónév alapján - visszaadja az uid-t, hogy a role-t lehessen lekérni
export const signInWithUsername = async (username: string, password: string, rememberMe: boolean): Promise<string | null> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    const email = userDoc.data().email;
    const uid = userDoc.data().uid;

    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);

    return uid;
};

// Ellenőrzi a felhasználónév egyediségét és regisztrálja a user-t
export const registerUser = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
        const usersRef = collection(db, 'users');

        // Felhasználónév egyediségének ellenőrzése
        const usernameCheck = query(usersRef, where('username', '==', username));
        const exists = !(await getDocs(usernameCheck)).empty;

        if (exists) {
            console.error('Felhasználónév már foglalt.');
            return false;
        }

        // Firebase Authentication user létrehozása
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Felhasználó mentése Firestore-ba
        await setDoc(doc(usersRef, uid), {
            uid,
            username,
            email,
            role: 'user'  // Alapértelmezett globális szerepkör
        });

        // Felhasználó automatikus hozzárendelése az összes kampányhoz
        const campaignsRef = collection(db, 'campaigns');
        const campaignsSnapshot = await getDocs(campaignsRef);

        const addToCampaigns = campaignsSnapshot.docs.map(async (campaignDoc) => {
            const campaignRef = doc(db, 'campaigns', campaignDoc.id);
            const playerData = {
                uid,
                username,
                role: 'user'  // Alapértelmezett kampány-szerepkör
            };

            await updateDoc(campaignRef, {
                players: arrayUnion(playerData)
            });
        });

        await Promise.all(addToCampaigns);

        return true;  // Sikeres regisztráció
    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        return false;
    }
};

// Lekérdezi az adott uid-hoz tartozó globális szerepkört (admin, user)
export const getUserGlobalRole = async (uid: string): Promise<string> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    return userDoc.data().role || 'user';
};
