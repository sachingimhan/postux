const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uniqueId: { type: String, unique: true },
    blocked: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    userRole: { type: String, enum: ["owner", "user"], default: "owner" },
    subRole: { type: String, enum: ["admin", "employee"], default: "admin" },
    mobileNo:{ type:String }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.index({
    "email": "text"
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(parseInt(process.env.SALT_ROUD), (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hashPassword) => {
            if (err) return next(err);
            this.password = hashPassword;
            next();
        })
    })
})

userSchema.methods.validatePassword = function (data, cb) {
    bcrypt.compare(data, this.password, (err, val) => {
        if (err) return cb(err);
        else return cb(null, val);
    });
}

userSchema.methods.genToken = function () {
    return new Promise((resolve, reject) => {
        let payload = {
            email: this.email,
            id: this.uniqueId
        };
        jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '1d',
        }, (err, token) => {
            if (err) return reject(err);
            resolve(token)
        });
    })
}

module.exports = mongoose.model("User", userSchema);
