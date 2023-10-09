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
        taxNo: data.taxNo,
        owner: user._id,
        storeId: randomId(5),
        users: []
    });
    store.save()
        .then((result) => {
            return res.send({ statusCode: '00', message: 'Store created successfully.', data: result });
        })
        .catch((err) => {
            return res.status(400).send({ statusCode: '05', message: 'can not create a store' });
        });
});

router.get('/', (req, res, next) => {
    let user = req.user;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to fetch store(s)' });
    }
    Model.Store.find({ owner: user._id })
        .populate('storeOwner')
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
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to fetch store(s)' });
    }
    Model.Store.findOne({ _id: storeId, owner: user._id })
        .populate('storeOwner')
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'Store not found' })
            } else {
                return res.send({ statusCode: '00', message: 'Store Data found', data: result });
            }
        })
        .catch((err) => {
            return res.status(400).send({ statusCode: '05', message: 'Store data fetch error.' });
        })
});

router.put('/:storeId', (req, res, next) => {
    let user = req.user;
    let data = req.body;
    let storeId = req.params.storeId;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to update store' });
    }

    Model.Store.findOne({ _id: storeId, owner: user._id })
        .exec()
        .then((result) => {

            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'Store not found' })
            }
            result.name = data.name ? data.name : result.name;
            result.address = data.address ? data.address : result.address;
            result.taxNo = data.taxNo ? data.taxNo : result.taxNo;
            result.registrationNumber = data.registrationNumber ? data.registrationNumber : result.registrationNumber;
            result.status = typeof data.status == 'boolean' ? data.status : result.status;
            result.save()
                .then((s) => {
                    return res.send({ statusCode: '00', message: 'Store Data updated', data: s });
                })
                .catch((err) => {
                    return res.status(400).send({ statusCode: '05', message: 'Store data update error' });
                })
        })
        .catch((err) => {
            return res.status(400).send({ statusCode: '05', message: 'Store data fetch error' });
        })
})

router.put('/addusers/:storeId', (req, res, next) => {
    let user = req.user;
    let data = req.body;
    let storeId = req.params.storeId;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to create a store' });
    }

    Model.Store.findOne({ _id: storeId, owner: user._id })
        .exec()
        .then((result) => {

            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'Store not found' })
            }
            result.users = typeof data.users == 'object' ? data.users : result.users;
            result.save()
                .then((s) => {
                    return res.send({ statusCode: '00', message: 'Store Data updated', data: s });
                })
                .catch((err) => {
                    return res.status(400).send({ statusCode: '05', message: 'Store data update error' });
                })
        })
        .catch((err) => {
            return res.status(400).send({ statusCode: '05', message: 'Store data fetch error' });
        })
})

module.exports = router;