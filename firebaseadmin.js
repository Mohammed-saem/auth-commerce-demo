import { initializeApp, cert } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

const app = initializeApp({
    credential: cert(serviceAccount),
});

export default app;