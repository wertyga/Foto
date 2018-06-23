import mongoose from 'mongoose';
import models from '../data/products';

const ProductModel = () => {
    return new mongoose.Schema({
        title: String,
        description: String,
        category: String,
        price: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        show: {
            type: Boolean,
            default: true
        },
        imagePath: {
            type: String,
            default: ''
        }
    });
};

export default [{ name: 'Все', title: 'all' }].concat(models.map(item => { return { ...item, model: mongoose.model(item.title, new ProductModel()) } }))