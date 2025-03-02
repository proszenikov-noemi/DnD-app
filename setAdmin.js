import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// 🔹 serviceAccountKey.json beolvasása (ESM-ben nincs require)
const serviceAccount = JSON.parse(
    await readFile(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function setAdmin(uid) {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Admin jogok sikeresen beállítva: ${uid}`);
}

// Itt írd be az admin user UID-ját
const adminUid = 'A8XKOBqH65X1FvBYDW8g7IaC4KG2';

setAdmin(adminUid)
    .then(() => process.exit())
    .catch((err) => {
        console.error('❌ Hiba:', err);
        process.exit(1);
    });
