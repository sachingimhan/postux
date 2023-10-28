var express = require('express');
var Model = require('../model');
var Util = require('../util/util');

var router = express.Router();

router.post('/', (req, res, next) => {
    let user = req.user;
    let data = req.body;
    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission, please contact Admin' });
    }
    if (!data.email) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
    } else if (!Util.EmailValidater(data.email)) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
    } else if (!data.password) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Password' });
    } else {
        let nuser = new Model.User({
            email: data.email,
            password: data.password,
            name: data.name,
            uniqueId: Util.GenUuid(),
            mobileNo: data.mobileNo,
            userRole: "user",
            subRole: data.subRole,
            store: data.store,
            owner: user._id
        });
        nuser.save()
            .then(() => {
                return res.send({ statusCode: '00', message: 'User creation success' });
            }).catch((err) => {
                console.error("Error: ", err);
                return res.status(400).send({ statusCode: '02', message: 'User already exists' });
            });
    }
});

router.get('/', (req, res, next) => {
    let user = req.user;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission please contact Admin' });
    }

    Model.User.find({ owner: user._id })
        .populate("storeOfUser")
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'Users not found' })
            } else {
                return res.send({ statusCode: '00', message: 'Users data found', data: result });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({ statusCode: '05', message: 'User data fetch error.' });
        })
});

router.get('/:userId', (req, res, next) => {
    let user = req.user;
    let userId = req.params.userId;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission please contact Admin' });
    }

    Model.User.findOne({ _id: userId })
        .populate("storeOfUser")
        .populate("ownerOfUser")
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'User not found' })
            } else {
                return res.send({ statusCode: '00', message: 'User data found', data: result });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({ statusCode: '05', message: 'User data fetch error.' });
        })
});

router.put('/:userId', (req, res, next) => {
    let user = req.user;
    let userId = req.params.userId;
    let data = req.body;
    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission, please contact Admin' });
    } else if (!data.email) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
    } else if (!Util.EmailValidater(data.email)) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
    } else if (!data.password) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Password' });
    } else {
        Model.User.findOne({ _id: userId })
            .exec()
            .then((result) => {
                if (!result) {
                    return res.status(400).send({ statusCode: '01', message: 'User not found' })
                } else {
                    result.email = data.email || result.email;
                    result.password = data.password || result.password;
                    result.name = data.name || result.name;
                    result.mobileNo = data.mobileNo || result.mobileNo;
                    result.subRole = data.subRole || result.subRole;
                    result.store = data.store || result.store;
                    result.save()
                        .then(() => {
                            return res.send({ statusCode: '00', message: 'User update success' });
                        }).catch((err) => {
                            console.error("Error: ", err);
                            return res.status(400).send({ statusCode: '02', message: 'User email exists' });
                        });
                }
            })
    }
});

router.delete('/:userId',(req, res, next)=>{
    let user = req.user;
    let userId = req.params.userId;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission, please contact Admin' });
    }
    Model.User.findOne({ _id: userId, owner: user._id })
            .exec()
            .then((result)=>{
                if(!result){
                    return res.status(400).send({ statusCode: '01', message: 'User not found' })
                }else{
                    
                    if(result.userRole == "owner"){
                        return res.send({ statusCode: '00', message: 'You do not have permission to delete owner, please contact Admin' });
                    }else{
                        result.deleteOne();
                        return res.send({ statusCode: '00', message: 'User delete success' });
                    }
                }
            })
            .catch((err)=>{
                console.error("Error: ", err);
                return res.status(400).send({ statusCode: '02', message: 'can not delete user' });
            });
});

module.exports = router;