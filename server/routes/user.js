import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import shell from 'shelljs';

import forIn from 'lodash/forIn';

import log from '../common/log';
import clientConfig from '../common/clientConfig';
import emailConfig from '../common/emailConfig';
import config from '../common/config';

import { validateInput } from '../common/validate';
import checkUser from '../middlewares/checkUser';
import checkFiles from '../middlewares/checkFiles';

import User from '../models/user';
import RecoveryPass from '../models/recoveryPass';
import Order from '../models/order';

let route = express.Router();


route.post('/api/login-register', (req, res) => {
    const { register } = req.body;
    const { isValid, errors } = validateInput({...req.body}, {ignore: ['register']});
    if(!isValid) {
        res.status(400).json({ error: errors })
    } else if(register) {
            const { username, email, password } = req.body;
            return User.findOne({ username })
                .then(user => {
                    if(user) {
                        res.status(400).json({ error: { username: 'Пользователь с таким именем уже существует' } });
                    } else {
                        const hashPassword = bcrypt.hashSync(password);
                        return new User({
                            ...req.body,
                            hashPassword
                        }).save()
                            .then(user => {
                                const token = jwt.sign({
                                    _id: user._id,
                                    username: user.username,
                                    email: user.email,
                                    phone: user.phone,
                                    address: user.address
                                }, clientConfig.secret);
                                res.json({ token })
                            });
                    }
                })
                .catch(err => {
                    log.error(err.message || err);
                    res.status(500).json({ error: { globalError: err.message } })
                });
        } else {
            const { loginUsername, loginPass } = req.body;

            return User.findOne({ $or: [{ username: loginUsername }, { email: loginUsername }]})
                .then(user => {
                    if(!user) {
                        res.status(400).json({ error: { loginUsername: 'Нет такого пользователя' } });
                    } else {
                        const pass = bcrypt.compareSync(loginPass, user.hashPassword);
                        if(pass) {
                            const token = jwt.sign({
                                _id: user._id,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                address: user.address
                            }, clientConfig.secret);
                            res.json({ token });
                        } else {
                            res.status(400).json({ error: { loginPass: 'Не верный пароль' } });
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                    log.error(err.message || err);
                    res.status(500).json({ error: { globalError: err.message } })
                })
        };
});

route.post('/check-user', (req, res) => {
    const { username } = req.body;

    return User.findOne({ username })
        .then(user => {
            if(user) {
                res.json(`${username} confirmed`)
            } else {
                res.status(400).json({ error: 'No user' })
            }
        });
});

route.post('/api/recovery-pass', (req, res) => {
    const { username } = req.body;
    const { isValid, errors } = validateInput({ username });
    if(!isValid) {
        res.status(400).json({ error: errors.username })
    } else {
        return User.findOne({ username })
            .then(user => {
                if(!user) {
                    res.status(400).json({ error: 'Нет такого пользователя' });
                } else {
                    return new RecoveryPass({ username: user.username }).save()
                        .then(recovery => {
                            const transporter = nodemailer.createTransport(emailConfig);
                            const mailOptions = {
                                from: 'Фотоателье "Подсолнух"',
                                to: user.email,
                                subject: 'Восстановление пароля',
                                html: `
                                    <div>Ссылка для восстановления пароля:</div>
                                    <a href=${config.hostAddress}/user/recovery-link/${recovery._id}>${config.hostAddress}/user/recovery-link/${recovery._id}</a>
                                    <div>Ссылка будет доступна в течении 60 минут</div>
                                `
                            };

                            transporter.sendMail(mailOptions, (err, info) => {
                                if(err) {
                                    res.status(500).json({ error: 'Сообщение не отправлено!' })
                                } else {
                                    res.json('its ok')
                                }
                            })
                        });
                }
            })
            .catch(err => {
                log.error(err.message);
                res.status(500).json({ error: err.message })
            })
    }
});

route.get('/recovery-link/:id', (req, res) => {
    const { id } = req.params;

    return RecoveryPass.findById(id)
        .then(recovery => {
            if(recovery) {
                res.sendFile(path.join(__dirname, '..', 'index.html'));
            } else {
                res.redirect('/login')
            }
        })

});

route.post('/update-password', (req, res) => {
    const { password, id } = req.body;

    const { errors, isValid } = validateInput({ password });
    if(!isValid) {
        res.status(400).json({ error: errors.password })
    } else if(id) {
        return RecoveryPass.findById(id)
            .then(recovery => {
                if(recovery) {
                    User.update({ username: recovery.username }, { $set: { hashPassword: bcrypt.hashSync(password) } })
                        .then(user => {
                            recovery.remove();
                            res.redirect('/login');
                        })
                } else {
                    res.status(400).json({ error: "Время вышло" });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    };
});

route.post('/api/rename-user', (req, res) => {
    if(!checkUser(req.headers, req.body._id)) {
        res.redirect('/login');
        return;
    };
    let checkObj = {};
    let userObj = {};
    for(let key in req.body) {
        if(key === '_id') continue;
        if(req.body[key].require) {
            checkObj[key] = req.body[key].fixedValue;
        };
        userObj[key] = req.body[key].fixedValue;
    };
    const { isValid, errors } = validateInput(checkObj);
    if(!isValid) {
        res.status(400).json({ error: errors })
    } else {
        return User.findByIdAndUpdate(req.body._id, { $set: { ...userObj } }, { new: true })
            .then(user => {
                let newUser = { _id: user._id };
                forIn(userObj, (value, key) => {
                    newUser[key] = user[key];
                });
                res.json({ token: jwt.sign(newUser, clientConfig.secret) });
            })
            .catch(err => {
                res.status(500).json({ globalError: err.message })
            })
    };
});

route.get('/api/fetch-orders/:_id', (req, res) => {
    const {_id} = req.params;

    if(!checkUser(req.headers, _id)) {
        res.redirect('/login');
        return;
    };

    return Order.find({ owner: _id })
        .then(orders => {
            return checkFiles(orders);
        })
        .then(orders => res.json(orders.filter(order => !!order)))
        .catch(err => res.status(500).json({ error: err.message }))
});

route.post('/api/delete-order', (req, res) => {
    const { id } = req.body;

    return Order.findOne({ orderName: id })
        .then(order => {
            if(!checkUser(req.headers, order.owner)) {
                res.redirect('/login');
            } else if(order.status === 'progress') {
                res.status(409).json({ error: 'order is in progress' });
                return;
            } else {
                Promise.all([
                    order.remove(),
                    shell.rm('-rf', `${config.uploads.ordersPath}/${order.datePath}/${order.orderName}`),
                ])
                    .then(() => res.json(`success deleted ${id} order`))
                    .catch(err => { throw err })

            }
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
});

export default route;