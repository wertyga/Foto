import fs from 'fs';
import flattenDeep from 'lodash/flattenDeep';
import path from 'path';
import shell from 'shelljs';

import config from '../common/config';
const log = require('../common/log')(module);
import Order from '../models/order';

export default function searchAndDeleteExpiresOrders() {
    fs.readdir(config.uploads.ordersPath, (err, ordersDates) => {
        if(err) {
            log.error(err.message);
        } else {
            Promise.all(ordersDates.map(date => {
                const orderNames = fs.readdirSync(path.join(config.uploads.ordersPath, date));
                return {
                    date,
                    orderNames
                }
            }))
                .then(orders => {
                    orders = flattenDeep(orders);

                    Promise.all(orders.map(order => {
                        Promise.all(order.orderNames.map(item => {
                            Order.findOne({ orderName: item })
                                .then(existOrder => {
                                    if(!existOrder) {
                                        shell.rm('-rf', path.join(config.uploads.ordersPath, order.date, item))
                                    }
                                })
                        }))
                            .catch(err => { throw err });
                    }))
                        .catch(err => { throw err });
                })
                .catch(err => {
                    log.error(err.message);
                })
        }
    });
};