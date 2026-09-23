import mongoose from 'mongoose';


const cardSchema = new mongoose.Schema(
    {
          userId: { type: String, required: true },
          items: [
            {
                productId: String,
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
    },
      { timestamps: true }
)
export default mongoose.model('Card', cardSchema);