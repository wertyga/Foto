import mongoose from 'mongoose';

const recoveryPass = mongoose.Schema({
    username: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 3600 }
    }
});

export default mongoose.model('recovery', recoveryPass);

