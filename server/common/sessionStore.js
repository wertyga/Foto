import mongoose from './mongoose';
import session from 'express-session';
const mongoStore = require('connect-mongo')(session);

export default new mongoStore({ mongooseConnection: mongoose.connection });