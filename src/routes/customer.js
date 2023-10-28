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

router.get('/',(req,res,next)=>{
    let user = req.user;
    Model.Customer.find({})
    .exec()
    .then((result)=>{
        if(!result){
            return res.status(400).send({ statusCode: '01', message: 'Customers not found' });
        }else{
            return res.send({ statusCode: '00', message: 'Customers data found', data: result });
        }
    }).catch((err)=>{
        console.error(err);
        return res.status(400).send({ statusCode: '05', message: 'can not fetch customers' });
    })
});

router.get('/:custId',(req,res,next)=>{
    let user = req.user;
    let custId = req.params.custId;
    Model.Customer.findOne({ _id: custId, owner: user.ownerOfUser._id })
    .populate('regStore')
    .exec()
    .then((result)=>{
        if(!result){
            return res.status(400).send({ statusCode: '01', message: 'Customers not found' });
        }else{
            return res.send({ statusCode: '00', message: 'Customers data found', data: result });
        }
    }).catch((err)=>{
        console.error(err);
        return res.status(400).send({ statusCode: '05', message: 'can not fetch customers' });
    })
});

router.put('/:custId',(req, res,next)=>{
    let user = req.user;
    let custId = req.params.custId;
    let data = req.body;

    if (user.subRole == "employee") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to Update Customer.' });
    } else {
        Model.Customer.findOne({ _id: custId, owner: user.ownerOfUser._id })
        .exec()
        .then((result)=>{
            if(!result){
                return res.status(400).send({ statusCode: '01', message: 'Customers not found' });
            }else{
                result.name = data.name || result.name;
                result.address = data.address || result.address;
                result.city = data.city || result.city;
                result.contact = data.contact || result.contact;
                result.country = data.country || result.country;
                result.email = data.email || result.email;
                result.profileImage = data.profileImage || result.profileImage;
                result.save()
                .then((p)=>{
                    return res.send({ statusCode: '00', message: 'Cusomer Data updated', data: p });
                }).catch((err)=>{
                    console.log(err);
                    return res.status(400).send({ statusCode: '01', message: 'Customer update error' });
                })
            }
        })
    }
});

module.exports = router;