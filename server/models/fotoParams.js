import mongoose from 'mongoose';

const paramsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    paperType: {
        type: Array,
        default: [
            {
                title: 'gl',
                name: 'Глянцевая',
                value: true
            },
            {
                title: 'mt',
                name: 'Матовая',
                value: true
            }
        ]
    }
});

export default mongoose.model('param', paramsSchema);