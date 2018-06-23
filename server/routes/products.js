import express from 'express';
import flatten from 'lodash/flatten';
import config from '../common/config';

const Models = config.models;

let Router = express.Router();

Router.get('/:title',  (req, res) => {
    const { title } =  req.params;
    if(title === 'all') {
        Promise.all(Models.slice(1).map(item => item.model.find({ show: true })))
            .then(resolve => res.json(flatten(resolve)))
            .catch(err => res.status(500). json({ error: err.message }))
    } else {
        Models.find(item => item.title === title).model.find({ show: true })
            .then(products => res.json( products ))
            .catch(err => res.status(500).json({ error: err.message }))
    };
});

let i = 0;


Router.get('/save-new/:title', (req, res) => {
    const { title } = req.params;


    let random = Math.round(Math.random());

    const model = Models.find(item => item.title === title);
    new model.model({
        title: `Some ${title} - ${i++}`,
        description: 'Some long long long description',
        price: !random ? 0 : (Math.random() * 100).toFixed(2),
        discount: !random ? 0 : Math.round(Math.random() * 100),
        category: model.name,
        imagePath: !random ? '' : '13.jpg'
    }).save()
        .then(res.json('success'))
        .catch(err => {console.log(err); res.json('error', err.message)})
});

export default Router;