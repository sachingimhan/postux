const jsonwebtoken = require('jsonwebtoken');

const Model = require('../model');

const checkAuth = (req, res, next) => {
    let nonSecureApi = ['/login','/register','/store'];
    let token = req.headers['authorization'];
    
    if(nonSecureApi.indexOf(req.path) >= 0){
        return next();
    }
    if (!token || token.length == 0) {
        return res.status(401).send({ statusCode: '401', message: 'Unauthorized Access' })
    }

    let apiKey = token.split(' ')[1];
    if (!token.startsWith('Bearer') || apiKey.length == 0) {
        return res.status(401).send({ statusCode: '401', message: 'Unauthorized Access' })
    }

    jsonwebtoken.verify(apiKey, process.env.TOKEN_SECRET, function (err, data) {
        if (err) {
            return res.status(401).send({ statusCode: '401', message: 'Unauthorized Access' })
        } else {
            Model.User.findOne({ email: data.email, uniqueId: data.id })
                .exec()
                .then((user) => {
                    req.user = user;
                    return next();
                })
                .catch((err) => {
                    console.error("Auth: ", err);
                    return res.status(401).send({ statusCode: '401', message: 'Unauthorized Access' })
                })
        }
    });
}

exports.checkAuth = checkAuth;