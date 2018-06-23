import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: String,
    phone: String,
    address: String,
    hashPassword: String
});

export default mongoose.model('user', userSchema);

