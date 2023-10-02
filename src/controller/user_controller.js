var Model = require('../model');
var Util = require('../util/util');

const register = (req, res, next) => {
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
}

const login = (req,res,next)=>{
    try {
        let data = req.body;
        if (!data.email) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid email' });
        } else if (!Util.EmailValidater(data.email)) {
            return res.status(400).send({ statusCode: '01', message: 'Invalid email format' });
        } else {
            Model.User.findOne({ email: data.email })
                .exec().then((user) => {
                    user.validatePassword(data.password, (err, isMatch) => {
                        if (err || !isMatch) {
                            return res.status(400).send({ statusCode: '01', message: 'Invalid Password' });
                        } else {
                            user.genToken()
                                .then((token) => {
                                    return res.send({
                                        statusCode: '00', message: 'Login Success', data: {
                                            authToken: token,
                                            user:{
                                                name:user.name,
                                                email:user.email,
                                                verified:user.verified,
                                                userRole:user.userRole,
                                                subRole:user.subRole
                                            }
                                        }
                                    });
                                }).catch((err) => {
                                    console.error(err);
                                    return res.status(400).send({ statusCode: '01', message: 'Token Gen Fail' });
                                })
                        }
                    });
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
}

module.exports = {
    register,
    login
};