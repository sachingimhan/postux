const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    storeId: { type: String },
    address: { type: String, required: true, unique: true },
    taxNo: { type: String, default: null },
    registrationNumber: { type: String, default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

storeSchema.index({
    "storeId": "text"
});

storeSchema.virtual("StoreOwner", {
    ref: 'User',
    localField: 'owner',
    foreignField: '_id',
    justOne: true
});

storeSchema.virtual("StoreUsers", {
    ref: 'User',
    localField: "users",
    foreignField: '_id'
});

module.exports = mongoose.model("Store", storeSchema);
