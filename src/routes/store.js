const express = require('express');
const Model = require('../model');
const { randomId } = require('../util/util');

const router = express.Router();

router.post('/', (req, res, next) => {
    let user = req.user;
    let data = req.body;

    if (!data.name) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Store Name' });
    }
    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to create a store' });
    }
    let store = new Model.Store({
        name: data.name,
        address: data.address,
        registrationNumber: data.registrationNumber,
        taxNo: data.taxNom,
        owner: user._id,
        storeId: randomId(5),
        users: []
    });
    store.save((err) => {
        if (err) {
            return res.status(400).send({ statusCode: '05', message: 'can not create a store' });
        } else {
            return res.send({ statusCode: '00', message: 'Store created successfully.', data: store });
        }
    });
});

router.get('/all', (req, res, next) => {
    let user = req.user;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to create a store' });
    }
    Model.Store.find({ owner: user._id })
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'Store(s) not found' })
            } else {
                return res.send({ statusCode: '00', message: 'Store Data found', data: result });
            }
        })
        .catch((err) => {
            return res.status(400).send({ statusCode: '05', message: 'Store data fetch error.' });
        })
});

router.get('/:storeId', (req, res, next) => {
    let user = req.user;
    let storeId = req.params.storeId;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to create a store' });
    }
    Model.Store.findOne({ _id:storeId, owner:user._id })
    .exec()
    .then((result)=>{
        if (!result) {
            return res.status(400).send({ statusCode: '01', message: 'Store not found' })
        } else {
            return res.send({ statusCode: '00', message: 'Store Data found', data: result });
        }
    })
    .catch((err)=>{
        return res.status(400).send({ statusCode: '05', message: 'Store data fetch error.' });
    })
});

module.exports = router;