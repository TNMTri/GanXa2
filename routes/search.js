var express = require('express');
var router = express.Router();

var industry_schema = require('../models/industry_schema');
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
    var type = req.body.val();
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
router.get('/', function (req, res) {
    var type = req.param('type');
    /*var u = require('unidecode');
     var x = u('ấ');
     console.log(x);*/
    if (!req.param('type')) {
        store_schema.store.find(function (store_error, store_array) {
            industry_schema.industry.find(function (industry_error, industry_array) {
                req.session.store_array = store_array;
                req.session.industry_array = industry_array;
                res.render('search', {store_array: store_array, industry_array: industry_array,notification : "search industry"});
            });
        });
    } else {
        store_schema.store.find({store_category: {$in: [req.param("type")]}}, function (store_error, store_array) {
            res.render('search', {category_array: req.session.category_array, store_array: store_array});
        });
    }
});
module.exports = router;