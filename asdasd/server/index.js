'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require('./common/config');

var _config2 = _interopRequireDefault(_config);

var _sessionStore = require('./common/sessionStore');

var _sessionStore2 = _interopRequireDefault(_sessionStore);

var _searchAndDeleteExpiresOrders = require('./middlewares/searchAndDeleteExpiresOrders');

var _searchAndDeleteExpiresOrders2 = _interopRequireDefault(_searchAndDeleteExpiresOrders);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _emailConfig = require('./common/emailConfig');

var _emailConfig2 = _interopRequireDefault(_emailConfig);

var _fotoParams = require('./models/fotoParams');

var _fotoParams2 = _interopRequireDefault(_fotoParams);

var _admin = require('../Admin/server/routes/admin');

var _admin2 = _interopRequireDefault(_admin);

var _products = require('./routes/products');

var _products2 = _interopRequireDefault(_products);

var _uploads = require('./routes/uploads');

var _uploads2 = _interopRequireDefault(_uploads);

var _user = require('./routes/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = require('./common/log')(module);

// import { renderToString } from 'react-dom/server';
// import App from '../client/components/App/App';

//******************************** ROUTES************

//*********************************

//**************** MIDDLEWARES ****************


//********************************************

var dev = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development';

var app = (0, _express2.default)();

if (dev ? false : _cluster2.default.isMaster) {

    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i += 1) {
        _cluster2.default.schedulingPolicy = _cluster2.default.SCHED_NONE;
        _cluster2.default.fork();
    }

    _cluster2.default.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        _cluster2.default.fork();
    });
} else {

    var server = _http2.default.createServer(app);

    //****************** Webpack ********************
    if (dev) {
        var webpack = require('webpack');
        var webpackConfig = require('../webpack.dev.config');
        var webpackHotMiddleware = require('webpack-hot-middleware');
        var webpackMiddleware = require('webpack-dev-middleware');

        var compiler = webpack(webpackConfig);

        app.use(webpackMiddleware(compiler, {
            hot: true,
            publicPath: webpackConfig.output.publicPath,
            noInfo: true
        }));
        app.use(webpackHotMiddleware(compiler));
    }

    //**********************************************

    app.use(_bodyParser2.default.json());
    app.use(_bodyParser2.default.urlencoded({
        extended: true,
        limit: '500mb'
    }));

    //************ STATIC **************

    // app.use(express.static(path.join(__dirname, 'products')));
    // app.use(express.static(config.uploads.destination));
    app.use(_express2.default.static(_path2.default.join(__dirname, '..')));
    app.use(_express2.default.static(_config2.default.uploads.ordersPath));
    app.use(_express2.default.static(__dirname));

    app.use(_express2.default.static(_path2.default.join(__dirname, 'src')));

    //****************************************

    //**************** SESSION ********************
    app.use((0, _expressSession2.default)({
        secret: _config2.default.session.secret,
        saveUninitialized: false,
        resave: true,
        key: _config2.default.session.key,
        cookie: _config2.default.session.cookie,
        store: _sessionStore2.default
    }));
    //*********************************************

    //************************* GARBAGE magic ***********************************

    // Для работы с garbage collector запустите проект с параметрами:
    // node --nouse-idle-notification --expose-gc app.js
    if (!dev) {
        var init = function init() {
            gcInterval = setInterval(function () {
                gcDo();
            }, 60000);
        };

        var gcDo = function gcDo() {
            global.gc();
            clearInterval(gcInterval);
            init();
        };

        var gcInterval = void 0;

        ;

        ;

        init();
    }

    //************************************************************

    //******************************** Routes ***************************
    app.use('/admin', _admin2.default);
    app.use('/upload', _uploads2.default);
    app.use('/products', _products2.default);
    app.use('/user', _user2.default);

    app.get('/fetch-foto-params', function (req, res) {
        _fotoParams2.default.find({}).then(function (params) {
            return res.json({ params: params });
        }).catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
    });

    app.post('/send-message', function (req, res) {
        var _req$body = req.body,
            name = _req$body.name,
            message = _req$body.message,
            contacts = _req$body.contacts;


        if (!contacts) {
            res.status(400).json({ error: 'Что-то не так с контактными данными' });
        } else {
            var transporter = _nodemailer2.default.createTransport(_emailConfig2.default);
            var mailOptions = {
                from: 'Foto_Podsolnux',
                to: 'fotopodsolnux@gmail.com',
                subject: 'Message from "Fotopodsolnux"',
                html: '<div>From: ' + name + '</div><div>Contacts: ' + contacts + '</div><div>Message: ' + message + '</div>'
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    res.status(500).json({ error: 'Сообщение не отправлено!' });
                } else {
                    res.json('its ok');
                }
            });
        };
    });

    app.get('/*', function (req, res) {
        res.sendFile(_path2.default.join(__dirname, 'index.html'));
    });

    //******************************** Run server ***************************

    app.listen(_config2.default.PORT, function () {
        console.log('Server run on ' + _config2.default.PORT + ' port');
        var deleteInterval = setInterval(function () {
            return (0, _searchAndDeleteExpiresOrders2.default)();
        }, 1000 * 3600 * 24);
    });
};

//******************************** Uncaught Exception ***************************

// process.on('uncaughtException', function (err) {
//     log.error('uncaughtException:', err.message);
//     process.exit(1);
// });

// ********************************************************************************