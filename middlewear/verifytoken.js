import { getAuth } from 'firebase-admin/auth';
import app from '../firebaseadmin.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await getAuth(app).verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default verifyToken;