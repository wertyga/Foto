import path from 'path';
import fs from 'fs';

import config from '../common/config';

const Models = config.default.models;
//Models must be { title: 'some title', name: 'some name', model: model-mongoose } - Array

export default function (req, res, next) {
    const { productId } = req.body;
    const imagePath = `${req.file ? req.file.filename : req.body.image}`;

    if(!productId) {
        saveNewProduct({...req.body, imagePath}, res)
    } else {
        editProduct({...req.body, imagePath}, res)
    }
};

function saveNewProduct(opt, res) {
    const model = Models.find(item => item.name === opt.category);

    new model.model({...opt}).save((err, product) => {
        if(err) {
            res.status(500).json({ errors: err.message })
        } else {
            res.json({ product })
        }
    })
};

function editProduct(opt, res) {
    let Model = Models.find(item => item.title === opt.oldCategory);

    Model.model.findById(opt.productId, (err, product) => {
        if(err) {
            res.status(500).json({ errors: err.message })
        } else if(opt.category !== product.category) {
            saveNewProduct(opt, res);
            if(product.filePath !== opt.filePath) deleteImage(product);
            deleteProduct(product);
        } else {
            Model.model.findByIdAndUpdate(opt.productId, {...opt}, { new: true }, (err, result) => {
                if(err) {
                    res.status(500).json({ errors: err.message })
                } else {
                    if(product.filePath !== opt.filePath) deleteImage(product);
                    res.json({ product: result })
                }
            });
        }
    })
};

function deleteProduct(product) {
    try {
        product.remove();
    } catch(err) {
        log.error(err.message);
    }
};
function deleteImage(product) {
    if(!product.filePath) return;
    fs.unlink(path.join(config.uploads.destination, product.filePath), err => {
        if(err) {
            log.error(err.message) ;
            return;
        }
    });
};

export function deleteDoc(req, res, next) {
    const {id, category} = req.body.data;

    let Model = Models.find(item => item.title === category);
    Model.model.findById(id, (err, result) => {
        if(err) {
            log.error(err.message);
            res.status(500).json({ errors: err.message })
        } else {
            deleteImage(result);
            deleteProduct(result);
            res.end();
        }
    })
};