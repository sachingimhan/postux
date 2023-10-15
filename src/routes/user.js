/**
 * Imports
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var Model = require('../model');
var Util = require('../util/util');
const userController = require('../controller/user_controller');

/**
 * Object creation
 */
var router = express.Router();

router.post('/register', (req, res, next) => {
    try {
        let data = req.body;
        if (!data.email) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
        } else if (!Util.EmailValidater(data.email)) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
        } else if (data.password !== data.confirmPassword) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid Password' });
        } else {
            let user = new Model.User({
                email: data.email,
                password: data.password,
                name: data.name,
                uniqueId: Util.GenUuid(),
                mobileNo: data.mobileNo
            });
            user.save()
                .then(() => {
                    console.info("User registration success...");
                    return res.send({ statusCode: '00', message: 'User registration success' });
                }).catch((err) => {
                    console.error("Error: ", err);
                    return res.status(400).send({ statusCode: '02', message: 'User already exists' });
                });
        }
    } catch (error) {
        console.error("Catch Error: ", error);
        return res.status(400).send({ statusCode: '05', message: 'Error, please contact system administrator' });
    }
});

router.post('/login', (req, res, next) => {
    try {
        let data = req.body;
        if (!data.email) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid email' });
        } else if (!Util.EmailValidater(data.email)) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid email format' });
        } else {
            Model.User.findOne({ email: data.email })
                .exec()
                .then((user) => {
                    if(!user){
                        return res.status(400).send({ statusCode: '04', message: 'User Not found' });
                    }else{
                        user.validatePassword(data.password, (err, isMatch) => {
                            if (err || !isMatch) {
                                return res.status(400).send({ statusCode: '01', message: 'Invalid Password' });
                            } else {
                                user.genToken()
                                    .then((token) => {
                                        return res.send({
                                            statusCode: '00', message: 'Login Success', data: {
                                                authToken: token,
                                                user: {
                                                    name: user.name,
                                                    email: user.email,
                                                    verified: user.verified,
                                                    userRole: user.userRole,
                                                    subRole: user.subRole
                                                }
                                            }
                                        });
                                    }).catch((err) => {
                                        console.error(err);
                                        return res.status(400).send({ statusCode: '01', message: 'Token Gen Fail' });
                                    })
                            }
                        });
                    }
                })
                .catch((err) => {
                    console.error("Catch Error: ", err);
                    return res.status(400).send({ statusCode: '04', message: 'User Not Found' });
                })
        }
    } catch (error) {
        console.error("Catch Error: ", error);
        return res.status(400).send({ statusCode: '05', message: 'Error, please contact system administrator' });
    }
});

router.get('/', (req, res, next) => {
    let user = req.user;
    Model.User.findOne({ _id: user._id })
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'User not found' })
            } else {
                return res.send({ statusCode: '01', message: 'User data found', data: result });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({ statusCode: '05', message: 'User data fetch error.' });
        })
});

router.get('/all', (req, res, next) => {
    let user = req.user;

    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to update store' });
    }

    Model.User.find({ owner: user._id })
        .populate("storeOfUser")
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '01', message: 'Users not found' })
            } else {
                return res.send({ statusCode: '01', message: 'Users data found', data: result });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({ statusCode: '05', message: 'User data fetch error.' });
        })
});

router.post('/create', (req, res, next) => {
    let user = req.user;
    let data = req.body;
    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to update store' });
    }
    if (!data.email) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
    } else if (!Util.EmailValidater(data.email)) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Email' });
    } else if (!data.password) {
        return res.status(400).send({ statusCode: '01', message: 'Invalid Password' });
    } else {
        let user = new Model.User({
            email: data.email,
            password: data.password,
            name: data.name,
            uniqueId: Util.GenUuid(),
            mobileNo: data.mobileNo,
            userRole: "user",
            subRole: data.subRole
        });
        user.save()
            .then(() => {
                return res.send({ statusCode: '00', message: 'User registration success' });
            }).catch((err) => {
                console.error("Error: ", err);
                return res.status(400).send({ statusCode: '02', message: 'User already exists' });
            });
    }
});

module.exports = router;
