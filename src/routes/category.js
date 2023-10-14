const express = require('express');
const Model = require('../model');
const { randomId } = require('../util/util');

const router = express.Router();

router.post('/', (req, res, next) => {
    let user = req.user;
    let data = req.body;

    if (!data.name) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Catrgory Name' });
    }
    if (user.userRole != "owner") {
        return res.status(400).send({ statusCode: '01', message: 'You do not have permission to create a store' });
    }
    if (!data.store) {
        return res.status(400).send({ statusCode: '01', message: 'Please provide a Store' });
    }

    let catrgory = new Model.Category({
        name: data.name,
        description: data.description,
        categoryCode: randomId(5),
        categoryImage: data.categoryImage,
        owner: user._id,
        store: data.store
    });

    catrgory.save()
        .then((result) => {
            return res.send({ statusCode: '00', message: 'Catrgory created successfully.', data: result });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({ statusCode: '05', message: 'can not create a catrgory' });
        })
});

router.get('/',(req, res, next)=>{
    let user = req.user;
    let owner = user._id;
    
    let cond = {
        owner:owner
    }
    if(user.userRole != "owner"){
        cond.owner = user.ownerOfUser._id;
        cond.store = user.storeOfUser._id;
    }

    Model.Category.find(cond)
    .exec()
    .then((result)=>{
        if(!result){
            return res.status(400).send({ statusCode: '04', message: 'Category not found.' })
        }else{
            return res.send({ statusCode: '00', message: 'Category found', data: result });
        }
    })
    .catch((err)=>{
        console.log(err);
        return res.status(400).send({ statusCode: '01', message: 'Category fetch error' });
    });

});

router.get('/:catId',(req, res, next)=>{
    let user = req.user;
    let owner = user._id;
    let catId = req.params.catId;
    
    let cond = {
        owner:owner,
        _id: catId
    };

    if(user.userRole != "owner"){
        cond.owner = user.ownerOfUser._id;
        cond.store = user.storeOfUser._id;
    }

    Model.Category.find(cond)
    .populate('catProducts')
    .exec()
    .then((result)=>{
        if(!result){
            return res.status(400).send({ statusCode: '04', message: 'Category not found.' })
        }else{
            return res.send({ statusCode: '00', message: 'Category found', data: result });
        }
    })
    .catch((err)=>{
        console.log(err);
        return res.status(400).send({ statusCode: '01', message: 'Category fetch error' });
    });
});

module.exports = router;