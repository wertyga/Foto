import mongoose from 'mongoose';

//Ready status: 'await', 'progress', 'done'
import orderStatus from '../data/orderStatus';

const orderModel = new mongoose.Schema({
    orderName: String,
    datePath: String,
    status: {
        type: String,
        default: orderStatus[0]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    contacts: String,
    files: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 3600 * 24 * 30 }
    }
});

export default mongoose.model('order', orderModel);