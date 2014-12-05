var express = require('express');
var router = express.Router();

var industry_schema = require('../models/industry_schema');
var product_schema = require('../models/product_schema');
var store_schema = require('../models/store_schema');
router.get('/', function (req, res) {
    console.log("hehe");
    var type = req.param('type');
    console.log(type);

    if (!req.param('type')) {
        store_schema.store.find(function (store_error, store_array) {
            industry_schema.industry.find(function (industry_error, industry_array) {
                req.session.store_array = store_array;
                req.session.industry_array = industry_array;
                res.render('category', {store_array: store_array, industry_array: industry_array});
            });
        });
    } else {
        store_schema.store.find({store_category: {$in: [req.param("type")]}}, function (store_error, store_array) {
                res.render('category', {category_array: req.session.category_array, store_array: store_array});
        });
    }

    //industry_schema.industry.find({}, function (industry_error, industry_array) {

    })
});