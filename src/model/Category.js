const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryCode:{ type:String, unique:true },
    name:{ type: String, required:true },
    description:{ type:String },
    categoryImage:{ type:String },
    products:[{ type:mongoose.Schema.Types.ObjectId, ref:'Product' }],
    status:{ type: Boolean, default:true },
    store:{ type: mongoose.Schema.Types.ObjectId, ref:'Store' },
    owner:{ type:mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

categorySchema.index({
    "categoryCode":"text"
});

categorySchema.virtual("catProducts",{
    ref:'Product',
    localField:'products',
    foreignField:'_id'
});

categorySchema.virtual('catStore',{
    ref:'Store',
    localField:'store',
    foreignField:'_id',
    justOne:true
});

module.exports = mongoose.model("Category", categorySchema);
