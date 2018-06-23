import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import shell from 'shelljs';
import archiver from 'archiver';

import bcrypt from 'bcrypt-nodejs';

import config from '../common/config';

import Admin from '../models/Admin';

import adminAuth from '../middlewares/adminAuth';
import validation from '../middlewares/validation';
import multerUpload from '../middlewares/multerUpload';
import { deleteDoc } from '../middlewares/multerUpload';

import checkFiles from '../../../server/middlewares/checkFiles';

const Models = config.default.models;
import Params from '../../../server/models/fotoParams';
import Order from '../../../server/models/order';
import User from '../../../server/models/user';

const route = express.Router();

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.stat(config.default.uploads.destination, (err, stats) => {
            if(err) {
                if(err.code === 'ENOENT') {
                    try {
                        fs.mkdirSync(config.default.uploads.destination);
                        cb(null, config.default.uploads.destination)
                    } catch(err) {
                        log.error(err.message);
                        res.status(500).json({ errors: err.message });
                    }
                };
            } else {
                cb(null, config.default.uploads.destination);
            }
        });
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const uploads = multer({
    storage: multerStorage,
    fileFilter: function(req, file, cb) {
        if(file.mimetype.split('/')[0] !== 'image') {
            cb(null, false)
        } else {
            cb(null, true)
        }
    },
    limits: {
        fileSize: 10**7
    }
});

route.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'adminPage.html')));

route.get('/api/download/:orderName', adminAuth, (req, res) => {
    const { orderName } = req.params;

    return Order.findOne({ orderName })
        .then(order => {
            try {
                if(order) {
                    const [datePath, orderName] = [order.datePath, order.orderName];

                    const archive = archiver('zip', {
                        zlib: { level: 9 } // Sets the compression level.
                    });

                    const output = res;
                    const dirPath = path.join(config.default.uploads.ordersPath, datePath, orderName);
                    archive.directory(dirPath, orderName);
                    archive.pipe(res);
                    archive.finalize();
                } else {
                    res.status(410).json({ error: 'Заказ удален' });
                };
            } catch(err) {
                res.status(500).json({ error: err });
            };

        });
});

route.get('/api/delete-order/:orderName', adminAuth, (req, res) => {
    const { orderName } = req.params;

    return Order.findOne({ orderName })
        .then(order => {
            if(order) {
                return Promise.all([
                    shell.rm('-rf', path.join(config.default.uploads.ordersPath, order.datePath, order.orderName)),
                    order.remove()
                ]).then(() => res.json(`order ${orderName} deleted`))
            } else {
                res.status(410).json({ error: 'Заказ удален' });
            };
        })
        .catch(err => res.status(500).json({ error: err }))
});

route.get('/new/:pass', (req, res) => {
    const { pass } = req.params;
    return new Admin({ name: pass, hashPassword: bcrypt.hashSync(pass) }).save()
        .then(() => res.json('success'))
});
route.get('/make-foto-params/:title', (req, res) => {
    return new Params({ title: req.params.title }).save()
        .then(() => res.json('success'))
        .catch(err => res.status(500).json(err.message))
});

route.get('/*', adminAuth, (req, res) => res.sendFile(path.join(__dirname, '..', 'adminPage.html')));

route.post('/api/login', (req, res) => {
    const { isValid, errors } = validation(req.body);
    const { name, password } = req.body;

    if(!isValid) {
        res.status(400).json({ errors });
    } else {
        return Admin.findOne({ name }, (err, user) => {
            if(err) {
                res.status(500).json({ errors: err.message });
            } else if(!user) {
                res.status(400).json({ errors: { name: 'No such user' } });
            } else {
                bcrypt.compare(password, user.hashPassword, (err, pas) => {
                    if(err) {
                        console.log(err)
                        res.status(400).json({ errors: err.message });
                    } else if(!pas) {
                        res.status(400).json({ errors: { password: 'Password not correct' } });
                    } else {
                        try {
                            req.session.isAdmin = true;
                            req.session.save();
                            res.json('login admin')
                        } catch(err) {
                            // log.error(err);
                            // res.status(500).json({ errors: err.message })
                        }
                    }
                });
            }
        });
    }
});

route.post('/fetch-categories', (req, res) => {
    res.json({ categories: Models.map(item => { return { title: item.title, name: item.name } }) })
});

route.post('/get-category', (req, res) => {
    const { value } = req.body;
    if(value === 'all') {
        return Promise.all(Models.filter(item => item.title !== 'all').map(item => item.model.find({})))
            .then(reslv => {
                let products = [];
                reslv.forEach(prod => {
                    products.push(...prod);
                });
                res.json({ products })
            })
            .catch(err => console.log(err))
    } else {
        const productModel = Models.find(item => item.title === value);
        return productModel.model.find({})
            .then(products => res.json({ products }))
            .catch(err => res.status(500).json({errors: err.message}))
    }
});

route.post('/edit-product', uploads.single('image'), multerUpload, (req, res) => {});

route.post('/delete-product', deleteDoc, (req, res) => {});

route.post('/update-foto-params', (req, res) => {
    const { id, paper, type, value } = req.body;

    return Params.findById(id)
        .then(format => {
            let paperType = format.paperType.map(item => {
                if(item.title === type) {
                    return {
                        ...item,
                        value
                    }
                } else {
                    return item;
                }
            });
            return Params.findByIdAndUpdate(id, { $set: { paperType } }, { new: true })
                .then(result => res.json({ result }))
        })
        .catch(err => res.status(500).json({ error: err.message }))
});

route.post('/api/get-orders', (req, res) => {
    return Order.find({})
        .then(orders => checkFiles(orders))
        .then(orders => {
            return Promise.all(orders.map(order => User.findById(order.owner).then(user => {
                if(user) {
                    return {
                        _id: order._id,
                        orderName: order.orderName,
                        datePath: order.datePath,
                        status: order.status,
                        contacts: order.contacts,
                        files: order.files,
                        createdAt: order.createdAt,
                        owner: {
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            address: user.address
                        }
                    }
                } else {
                    return {
                        _id: order._id,
                        orderName: order.orderName,
                        datePath: order.datePath,
                        status: order.status,
                        contacts: order.contacts,
                        files: order.files,
                        createdAt: order.createdAt
                    }
                }
            })))
                .then(orders => res.json({ orders }))
        })
        .catch(err => res.status(500).json({ error: err }))
});

route.post('/api/change-order-status', adminAuth, (req, res) => {
    const { orderName, status } = req.body;

    return Order.findOne({ orderName })
        .then(order => {
            if(order) {
                order.status = status;
                order.save()
                    .then(order => res.json({ order }))
            } else {
                res.status(410).json({ error: 'Заказ удален' });
            };
        })
        .catch(err => res.status(500).json({ error: err }))
});

route.post('/change-show', (req, res) => {
    const { _id, category } = req.body;

    const productModel = Models.find(item => item.name === category);
    return productModel.model.findById(_id)
        .then(product => {
            product.show = !product.show;
            product.save()
                .then(() => res.json('success updated'))
                .catch(err => { throw err })
        })
        .catch(err => res.status(500).json({ error: err.message }))
});

export default route;