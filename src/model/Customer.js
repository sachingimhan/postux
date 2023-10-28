const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerCode: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    contact: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    profileImage:{ type: String },
    status: { type: Boolean, default: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

customerSchema.index({
    "customerCode": "text",
    "email":"text",
    "contact":"text"
});

customerSchema.virtual('regStore',{
    ref:"Store",
    localField:"store",
    foreignField:"_id",
    justOne:true
});

module.exports = mongoose.model("Customer", customerSchema);
