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

router.post('/register',userController.register);

router.post('/login',userController.login);

router.get('/',(req,res,next)=>{
    let user = req.user;
    Model.User.findOne({ _id:user._id })
    .exec()
    .then((result)=>{
        if(!result){
            return res.status(400).send({ statusCode: '01', message: 'User not found' })
        }else{
            return res.send({ statusCode: '01', message: 'User data found', data: result });
        }
    })
    .catch((err)=>{
        return res.status(400).send({ statusCode: '05', message: 'User data fetch error.' });
    })
});

module.exports = router;
