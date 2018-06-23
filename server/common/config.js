import path from 'path';
import models from '../models/index';

export default {
    PORT: 3000,
    mongoose: {
        uri: 'mongodb://localhost/',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    pg: {
        user: 'wertyga',
        pass: 'wertygan'
    },
    dbName: 'fotoPodsolnux',
    session: {
        secret: "nodeJSForever",
        key: "sid",
        cookie: {
            httpOnly: true,
            maxAge: 3600000
        }
    },
    hash: {
        secret: 'boooom!',
        salt: 10
    },
    uploads: {
        directory: 'productsImages',
        destination: path.join(__dirname, '../', 'productsImages'),
        maxFileSize: 50000000,
        ordersPath: path.join(__dirname, '../', '../', 'orders')
    },
    logFilePath: path.join(__dirname, '../', 'node.log'),
    models: models,
    hostAddress: 'http://localhost:3000'
}