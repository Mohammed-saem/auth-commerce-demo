import mongoose from 'mongoose'

const userSchema  = new mongoose.Schema(
    {
          firebaseUid: { type: String, required: true, unique: true },
           name: { type: String },

        email: { type: String, required: true },
    },
    { timestamps: true } 
)
export default mongoose.model('User', userSchema);