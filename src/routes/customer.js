const express = require('express');
const Model = require('../model');
const { randomId } = require('../util/util');

const router = express.Router();

router.post('/', (req, res, next) => {
    let user = req.user;
    let data = req.body;

    if (!data.name) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a customer Name' });
    } else if (!data.contact) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a contact Number' });
    } else {
        let customer = new Model.Customer({
            customerCode: randomId(8),
            name: data.name,
            address: data.address,
            city: data.city,
            contact: data.contact,
            country: data.country,
            email: data.email,
            profileImage: data.profileImage,
            owner: user.ownerOfUser._id,
            store: user.storeOfUser._id || data.store
        });

        customer.save()
            .then((result) => {
                return res.send({ statusCode: '00', message: 'customer addded successfully.', data: result });
            })
            .catch((err) => {
                console.error(err);
                return res.status(400).send({ statusCode: '05', message: 'can not create a customer' });
            })
    }

});

module.exports = router;