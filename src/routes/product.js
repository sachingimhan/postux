const express = require('express');
const Model = require('../model');
const { randomId } = require('../util/util');

const router = express.Router();

router.post('/', (req, res, next) => {
    let user = req.user;
    let data = req.body;

    if (!data.productName) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Product Name.' });
    } else if (!data.description) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Product Description.' });
    } else if (user.subRole == "employee") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to Add a Product.' });
    }

    let product = new Model.Product({
        productName: data.productName,
        description: data.description,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        minQty: data.minQty,
        qty: data.qty,
        retailPrice: data.retailPrice,
        category: data.category,
        owner: user.ownerOfUser._id,
        productCode: randomId(6),
        productImage: data.productImage,
        store: user.storeOfUser._id,
        tax: data.tax,
        unit: data.unit
    });
    product.save()
        .then(() => {
            return res.send({ statusCode: '00', message: 'Product add success' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({ statusCode: '01', message: 'Product save fail' })
        })

});

router.get('/', (req, res, next) => {
    let user = req.user;
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let from = (page - 1) * limit;
    Model.Product.find({ owner: user.ownerOfUser._id, store: user.storeOfUser._id })
        .populate('productStore')
        .skip(from)
        .limit(limit)
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '04', message: 'Products not found.' })
            }
            return res.send({ statusCode: '00', message: 'Products found', data: result });
        }).catch((err) => {
            console.log(err);
            return res.status(400).send({ statusCode: '01', message: 'Products fetch error' });
        })
});

router.put('/:productId', (req, res, next) => {
    let user = req.user;
    let productId = req.params.productId;
    let data = req.body;

    if (!data.productName) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Product Name.' });
    } else if (!data.description) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Product Description.' });
    } else if (user.subRole == "employee") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to Add a Product.' });
    }

    Model.Product.findOne({ _id: productId })
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '04', message: 'Products not found.' })
            } else {
                result.productName = data.productName || result.productName;
                result.description = data.description || result.description;
                result.discountAmount = data.discountAmount || result.discountAmount;
                result.discountType = data.discountType || result.discountType;
                result.minQty = data.minQty || result.minQty;
                result.qty = data.qty || result.qty;
                result.retailPrice = data.retailPrice || result.retailPrice;
                result.category = data.category || result.category;
                result.productImage = data.productImage || result.productImage;
                result.tax = data.tax || result.tax;
                result.unit = data.unit || result.unit;
                result.status = typeof data.status == 'boolean' ? data.status : result.status;
                result.save()
                    .then((p) => {
                        return res.send({ statusCode: '00', message: 'Product Data updated', data: p });
                    }).catch((err) => {
                        console.log(err);
                        return res.status(400).send({ statusCode: '01', message: 'Product update error' });
                    })
            }
        }).catch((err) => {
            console.log(err);
            return res.status(400).send({ statusCode: '01', message: 'Product fetch error' });
        })

});

router.get('/:productId', (req, res, next) => {
    let user = req.user;
    let productId = req.params.productId;

    Model.Product.findOne({ _id: productId, owner: user.ownerOfUser._id, store: user.storeOfUser._id })
        .populate('productStore')
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(400).send({ statusCode: '04', message: 'Product not found.' })
            }
            return res.send({ statusCode: '00', message: 'Product found', data: result });
        }).catch((err) => {
            console.log(err);
            return res.status(400).send({ statusCode: '01', message: 'Product fetch error' });
        });
});

module.exports = router;