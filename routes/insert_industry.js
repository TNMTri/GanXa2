var express = require('express');
var router = express.Router();

var industry_schema = require('../models/industry_schema');
var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
router.get('/', function (req, res) {

    if (!req.param("type")) {
        industry_schema.industry.find(function (industry_error, industry_array) {
            req.session.industry_array = industry_array;
            res.render('industry', {industry_array: industry_array});
        });
    } else {
        store_schema.store.find({store_category: {$in: [req.param("type")]}}, function (store_error, store_array) {
            product_schema.product.find({Category: {$in: [req.param("type")]}}, function (product_error, product_array) {
                res.render('industry', {category_array: req.session.category_array, store_array: store_array, product_array: product_array});
            });
        });
    }
});

router.post('/', function (req, res) {

    var industry_name = req.body.txtIndustryName;

    new industry_schema.categorys({
        _id: null,
        industry_name: industry_name
    }).save(function (err) {
            if (!err) {
                industry_schema.industry.find(function (err, industry_schema) {
                    req.session.industry_schema = industry_schema;
                    res.render('industry', {industry_schema: industry_schema});
                });
            }
        });
});

module.exports = router;