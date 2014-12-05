var express = require('express');
var router = express.Router();

var industry_schema = require('../models/industry_schema');
var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');

router.get('/', function (req, res) {

    var query_industry = industry_schema.industry.find({});
    query_industry.sort({date: -1});
    query_industry.exec(function (industry_error, industry_array) {
        if(industry_array && industry_array.length > 0){
            req.session.industry_array = industry_array;
        }else{
            console.log(industry_error);
        }
    });

    var query_store = store_schema.store.find({});
    query_store.limit(8);
    query_store.sort({date: -1});
    query_store.exec(function (store_error, store_array) {
        if (store_array && store_array.length > 0) {
            req.session.store_array = store_array;
        } else {
            console.log(store_error);
        }
    });

    var query_product = product_schema.product.find({});
    query_product.sort({date: -1});
    query_product.exec(function (product_error, product_array) {
        if(product_array && product_array.length > 0){
            req.session.industry_array = product_array;
        }else{
            console.log(product_error);
        }
    })
});

module.exports = router;