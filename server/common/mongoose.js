import mongoose from 'mongoose';

import config from './config';
const log = require('./log')(module);

mongoose.set({ debug: true });
mongoose.Promise = require('bluebird');

mongoose.connect(config.mongoose.uri + config.dbName, { useMongoClient: true }, (err, db) => {
    if(err) {
        log.error(err.message);
    } else {
        db.once('open', () => console.log('-- Mongoose connected --'))
    }
});

export default mongoose;