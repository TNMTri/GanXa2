var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var industry_schema = require('../models/industry_schema');

router.get('/', function (req, res) {

    var query_store = store_schema.store.find({});
    query_store.limit(8);
    query_store.sort({date: -1});
    query_store.exec(function (store_error, store_array) {
        if (store_array && store_array.length > 0) {
            req.session.store_array = store_array;
            var query_industry = industry_schema.industry.find({});
            query_industry.sort({industry_name: 1});
            query_industry.exec(function (industry_error, industry_array) {
                if (industry_array && industry_array.length > 0) {
                    req.session.store_array = store_array;
                    req.session.industry_array = industry_array;
                    res.render('index', {store_array: store_array, industry_array: industry_array});
                } else {
                    console.log(industry_error);
                }
            });
        } else {
            console.log(store_error);
        }
    })
});

module.exports = router;