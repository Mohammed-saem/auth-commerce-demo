import 'dotenv/config'; // Load environment variables first
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';


let serviceAccount = null;
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
}

else {
    const localKeyPath = path.resolve('serviceAccountKey.json');
    if (fs.existsSync(localKeyPath)) {
        try {
            const fileData = fs.readFileSync(localKeyPath, 'utf8');
            serviceAccount = JSON.parse(fileData);
        } catch (err) {
            console.error('Error reading serviceAccountKey.json:', err);
        }
    }
}

// If credentials found, initialize Firebase Admin app
const app = getApps().length === 0 && serviceAccount
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0] || null;

if (!serviceAccount) {
    console.warn('⚠️ Warning: Firebase Admin credentials not found. Please check .env or serviceAccountKey.json.');
}

export default app;