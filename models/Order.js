
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },

       
        products: [
            {
                productId: String,
                name: String,
                price: Number,
                quantity: Number,
            },
        ],

        totalAmount: Number,

        razorpayOrderId: String,
        razorpayPaymentId: String,

        status: { type: String, default: 'confirmed' },
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);