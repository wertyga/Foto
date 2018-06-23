import path from 'path';
import config from '../common/config';
import fs from 'fs';
import shell from 'shelljs';

export default function(orders) {
    if(orders.length < 1) {
        return [];
    } else {
        return Promise.all(orders.map(order => {
            const files = order.files.map(file => {
                const fullFilePath = path.join(config.uploads.ordersPath, file.filePath);
                try {
                    fs.statSync(fullFilePath);
                    return file;
                } catch(err) {
                    if(err.code === 'ENOENT') {
                        return false;
                    } else {
                        throw err;
                    }
                };
            }).filter(newFiles => !!newFiles);

            if(files.length !== order.files.length) {
                if(files.length < 1) {
                    order.remove();
                    shell.rm('-rf', path.join(config.uploads.ordersPath, order.datePath, order.orderName))
                } else {
                    order.files = files;
                    return order.save();
                }

            } else {
                return order;
            };

        }))
    }

}