import express from 'express';
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

import nodemailer from 'nodemailer';
import emailConfig from '../common/emailConfig';

import jwtDecode from 'jwt-decode';

import config from '../common/config';
const log = require('../common/log')(module);

import Order from '../models/order';
import User from '../models/user';

let Router = express.Router();

const needPath = (orderName, jwtString) => {
    const description = jwtDecode(jwtString);
    const format = description.format;
    const amount = description.amount;
    const paper = description.paper;
    const date = new Date();
    const ordersPath = config.uploads.ordersPath;
    const datePart = date.getDate() + '-' + (date.getMonth() + 1);
    const formatsAmountPath = path.join(format + '-' + paper, String(amount));

    return {
        datePath: datePart,
        formatsAmountPath,
        fullDirectoryPath: path.join(ordersPath, datePart, orderName, formatsAmountPath),
        fileId: description.id
    }
};

const sendEmailByOrder = (orderName) => {
    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = {
        from: 'Foto_Podsolnux',
        to: 'fotopodsolnux@gmail.com',
        subject: `new Order - ${orderName || 'No order'}`,
        html: `<div>Message: New order - ${orderName}</div>`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            log.error(err.message);
            console.error(`Email not sent: ${err}`)
        };
    })
};

Router.post('/users-fotos/:order', (req, res) => {
    let { user, contacts, orderName } = jwtDecode(req.params.order);
    let commonDatePath;

    if(!orderName || (!user && !contacts)) {
        res.status(400).json({error: { contactsError: 'Что то не так с данными' }});
        return;
    };
    req.order = [];
    const form = new multiparty.Form({
        maxFilesSize: config.uploads.maxFileSize
    });

    form.on('part', (part) => {
        let { datePath, fullDirectoryPath, fileId, formatsAmountPath } = needPath(orderName, part.name);
        commonDatePath = datePath;
        const decodePart = jwtDecode(part.name);

        try {
            fs.statSync(fullDirectoryPath);
        } catch(err) {
            if(err.code === 'ENOENT') {
                shell.mkdir('-p', fullDirectoryPath);
            } else {
                res.status(500).json({ error: err.message });
                log.error(err.message);
                return;
            }
        };

            const fileName = `${fileId}-${part.filename || decodePart.fileName }`;
            const ws = fs.createWriteStream(path.join(fullDirectoryPath, fileName));
            ws.on('error', (err) => {
                log.error(err);
                form.emit('error', { message: { globalError: err } });
            });

            if(part.filename) {
                part.pipe(ws);

            } else {
                const fullFilePath = path.join(config.uploads.ordersPath, decodePart.filePath);

                const rs = fs.createReadStream(fullFilePath);
                rs.pipe(ws);
                rs.on('error', async (err) => {
                    log.error(err);
                    part.resume();
                });

            };

            req.order.push({
                ...decodePart,
                filePath: path.join('/', datePath, orderName, formatsAmountPath, fileName),
                datePath,
                fileName
            });

    });

    form.on('finish', () => {
        if(req.order.length < 1){
            res.status(400).json({ error: 'Ошибка' });
            return;
        }
            return User.findOne({username: user})
                .then(user => {
                    let orderObj = {
                        contacts,
                        orderName: String(orderName),
                        datePath: req.order[0].datePath,
                        files: req.order
                    };
                    if (user) orderObj.owner = user._id;

                    return new Order(orderObj).save()
                        .then(() => {
                            res.json('success');
                            sendEmailByOrder(String(orderName));
                    });
                })
                .catch(err => {
                    res.status(400).json({error: {globalError: err.message}});
                    log.error(err.message)
                });
    });
    form.on('error', (err) => {
        res.status(500).json({ error: err.message });
        log.error(err);
    });

    form.parse(req);

});

export default Router;