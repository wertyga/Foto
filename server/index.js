import express from 'express';
import bodyParser from 'body-parser';

// import { renderToString } from 'react-dom/server';
// import App from '../client/components/App/App';

import path from 'path';
import cluster from 'cluster';
import http from 'http';

import session from 'express-session';
import config from './common/config';
const log = require('./common/log')(module);
import sessionStore from './common/sessionStore';
import searchAndDeleteExpiresOrders from './middlewares/searchAndDeleteExpiresOrders';

import nodemailer from 'nodemailer';
import emailConfig from './common/emailConfig';

import Params from './models/fotoParams';

//******************************** ROUTES************
import adminRoute from '../Admin/server/routes/admin';
import products from './routes/products';
import upload from './routes/uploads';
import user from './routes/user';
//*********************************

//**************** MIDDLEWARES ****************


//********************************************

const dev = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development';

const app = express();

if (dev ? false : cluster.isMaster) {

    let cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i += 1) {
        cluster.schedulingPolicy = cluster.SCHED_NONE;
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

} else {

    const server = http.createServer(app);

    //****************** Webpack ********************
    if(dev) {
        const webpack = require('webpack');
        const webpackConfig = require('../webpack.dev.config');
        const webpackHotMiddleware = require('webpack-hot-middleware');
        const webpackMiddleware = require('webpack-dev-middleware');

        const compiler = webpack(webpackConfig);

        app.use(webpackMiddleware(compiler, {
            hot: true,
            publicPath: webpackConfig.output.publicPath,
            noInfo: true
        }));
        app.use(webpackHotMiddleware(compiler));
    }

    //**********************************************

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '500mb'
    }));

    //************ STATIC **************

    // app.use(express.static(path.join(__dirname, 'products')));
    // app.use(express.static(config.uploads.destination));
    app.use(express.static(path.join(__dirname, '..')));
    app.use(express.static(config.uploads.ordersPath));
    app.use(express.static(__dirname));

    app.use(express.static(path.join(__dirname, 'src')));


    //****************************************

    //**************** SESSION ********************
    app.use(session({
        secret: config.session.secret,
        saveUninitialized: false,
        resave: true,
        key: config.session.key,
        cookie: config.session.cookie,
        store: sessionStore
    }));
    //*********************************************

    //************************* GARBAGE magic ***********************************

    // Для работы с garbage collector запустите проект с параметрами:
    // node --nouse-idle-notification --expose-gc app.js
    if(!dev) {
        let gcInterval;

        function init() {
            gcInterval = setInterval(function () {
                gcDo();
            }, 60000);
        };

        function gcDo() {
            global.gc();
            clearInterval(gcInterval);
            init();
        };

        init();
    }

    //************************************************************

    //******************************** Routes ***************************
    app.use('/admin', adminRoute);
    app.use('/upload', upload);
    app.use('/products', products);
    app.use('/user', user);

    app.get('/fetch-foto-params', (req, res) => {
        Params.find({}).then(params => res.json({ params }))
            .catch(err => res.status(500).json({ error: err.message }))
    });

    app.post('/send-message', (req, res) => {
        const { name, message, contacts } = req.body;

        if(!contacts) {
            res.status(400).json({ error: 'Что-то не так с контактными данными' });
        } else {
            const transporter = nodemailer.createTransport(emailConfig);
            const mailOptions = {
                from: 'Foto_Podsolnux',
                to: 'fotopodsolnux@gmail.com',
                subject: 'Message from "Fotopodsolnux"',
                html: `<div>From: ${name}</div><div>Contacts: ${contacts}</div><div>Message: ${message}</div>`
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if(err) {
                    res.status(500).json({ error: 'Сообщение не отправлено!' })
                } else {
                    res.json('its ok')
                }
            })
        };
    });

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'))
    });

    //******************************** Run server ***************************

    app.listen(config.PORT, () => {
        console.log(`Server run on ${config.PORT} port`);
        let deleteInterval = setInterval(() => searchAndDeleteExpiresOrders(), 1000 * 3600 * 24);
    });

};

//******************************** Uncaught Exception ***************************

// process.on('uncaughtException', function (err) {
//     log.error('uncaughtException:', err.message);
//     process.exit(1);
// });

// ********************************************************************************










