var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
router.get('/', function (req, res) {
    /*var key = req.param("keyword");
    store_schema.store.find({store_name: {$regex: key, $options: 'i'}}, function (store_error, store_array) {
        console.log(store_array);
        res.render('search', {store_array: store_array, industry_array: req.session.industry_array, notification: "Vừa search store."});
    });*/
    res.render('search', {industry_array: req.session.industry_array});
});

router.post('/', function (req, res) {
    var key;
    if (!req.param("keyword")) {
        key = req.body.txtTextSearch;
    }
    var type = req.body.type;
    if (type == "store") {
        store_schema.store.find({store_name: {$regex: key, $options: 'i, x'}}, function (store_error, store_array) {
            res.render('search', {store_array: store_array, industry_array: req.session.industry_array, notification: "Vừa search store."});
        });
    } else {
        product_schema.product.find({product_name: {$regex: key, $options: 'i, x'}}, function (product_error, product_array) {
            res.render('search', {product_array: product_array, industry_array: req.session.industry_array, notification: "Vừa search product."});
        });
    }
});

module.exports = router;