import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database.js';
import verifyToken from './middlewear/verifytoken.js';
import mongoose  from 'mongoose';
import User from './models/User.js';
import Card from './models/Card.js';  
import Order from './models/Order.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get('/', (req, res) => res.send('Server is running ✅'));

// ---------- Save user to DB after signup ----------
app.post('/api/user/save', verifyToken, async (req, res) => {
    try {
        const { uid, email } = req.user;
        const { name } = req.body;

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({ firebaseUid: uid, email, name });
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error saving user' });
    }
});

// ---------- Cart add/update ----------
app.post('/api/card', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { items } = req.body;

        // Atomic update using findOneAndUpdate (avoids version conflict errors)
        const updatedCart = await Card.findOneAndUpdate(
            { userId: uid },
            { $set: { items: items } },
            { new: true, upsert: true } // Creates a new document if not found
        );

        res.status(200).json({ success: true, cart: updatedCart });
    } catch (err) {
        console.error('Cart update error:', err);
        res.status(500).json({ success: false, message: 'Error updating cart' });
    }
});
// ---------- Cart get ----------
app.get('/api/card', verifyToken, async (req, res) => {
    try {
        const existingCard = await Card.findOne({ userId: req.user.uid });

        res.status(200).json({ success: true, cart: existingCard || { items: [] } });
    } catch (err) {
        console.error('Cart fetch error:', err);
        res.status(500).json({ success: false, message: 'Error fetching cart' });
    }
});

// ---------- Razorpay: create order ----------
app.post('/api/checkout/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid payment amount' });
        }

        const orderOptions = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(orderOptions);
        return res.status(200).json({ success: true, order });
    } catch (err) {
        console.error('Razorpay order creation error:', err);
        return res.status(500).json({ success: false, message: 'Could not create order' });
    }
});

// ---------- Razorpay: verify + Order save ----------
app.post('/api/checkout/verify', verifyToken, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products,
            totalAmount,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
        }

        const payloadData = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(payloadData)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        const order = await Order.create({
            userId: req.user.uid,
            products,
            totalAmount,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status: 'confirmed',
        });

        // Order confirmed -> clear cart (using Card model)
        await Card.findOneAndUpdate({ userId: req.user.uid }, { items: [] });

        return res.status(200).json({
            success: true,
            message: 'Payment completed successfully',
            order,
        });
    } catch (err) {
        console.error('Verification error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error during verification' });
    }
});

// ---------- Order history ----------
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));