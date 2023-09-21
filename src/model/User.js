const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    uniqueId: {type: String},
    blocked: {type: Boolean, default: false},
    verified: {type: Boolean, default: false},
    userRole: {type: String, enum: ["owner", "user"], default: "owner"}
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

user.index({
    "email": "text"
});

module.exports = mongoose.model("User", user);
