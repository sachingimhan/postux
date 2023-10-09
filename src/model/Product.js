const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode:{ type:String, unique:true },
    productName:{ type:String, required:true },
    category:{ type:mongoose.Schema.Types.ObjectId, ref:'Category' },
    unit:{ type:String },
    minQty:{ type:Number, required:true },
    qty: { type:Number, default:0 },
    description:{ type:String, required:true },
    tax:{ type:Number },
    discountType:{ type:String, default:'percentage', enum:['percentage','amount'] },
    discountAmount: { type:Number, default:0 },
    retailPrice:{ type:Number, default:0 },
    status:{ type:Boolean, default:true },
    productImage:{ type:String },
    store:{ type: mongoose.Schema.Types.ObjectId, ref:'Store' },
    owner:{ type:mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

productSchema.index({
    "productCode": "text",
    "owner":"text",
    "store":"text"
});

productSchema.virtual('productOwner',{
    ref:'User',
    foreignField:'_id',
    localField:'owner',
    justOne:true
});

productSchema.virtual('productStore',{
    ref:'Store',
    foreignField:'_id',
    localField:'store',
    justOne:true
});

module.exports = mongoose.model("Product", productSchema);
