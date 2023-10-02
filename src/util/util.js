const {v4:uuid4} = require('uuid');

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
/**
 * @return {boolean}
 */
var EmailValidater = function (email) {
    if (!email) return false;

    if (email.length > 256) return false;

    if (!emailRegex.test(email)) return false;

    // Further checking of some things regex can't handle
    var [account, address] = email.split('@');
    if (account.length > 64) return false;

    var domainParts = address.split('.');
    if (domainParts.some(function (part) {
        return part.length > 63;
    })) return false;

    return true;
};

const GenUuid = ()=>{
    return uuid4().replace(/-/g,'');
}

const randomId = (length) => {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

exports.EmailValidater = EmailValidater;
exports.GenUuid = GenUuid;
exports.randomId = randomId;