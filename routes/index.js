var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var industry_schema = require('../models/industry_schema');

router.get('/', function (req, res) {
    //Load all store:

    //Code cũ
    /*store_schema.store.find(function (store_error, store_array) {
     if (store_array && store_array.length > 0) {
     req.session.store_array = store_array;
     console.log("Có");
     res.render('index', {store_array: store_array, notification: "OK"});
     } else {
     console.log("tiêu");
     res.render('index');
     }
     });*/

    //Update lên tầm cao mới. =))
    var query = store_schema.store.find({});

    query.limit(8);
    query.sort({date: -1});
    query.exec(function (store_error, store_array) {
        if (store_array && store_array.length > 0) {
            req.session.store_array = store_array;

            industry_schema.industry.find(function (industry_error, industry_array) {
                if (industry_array && industry_array.length > 0) {
                    req.session.store_array = store_array;
                    req.session.industry_array = industry_array;
                    res.render('index', {store_array: store_array, industry_array: industry_array});
                }else{
                    console.log(industry_error);
                }
            });
        } else {
            console.log(store_error);
        }
    })
});

module.exports = router;