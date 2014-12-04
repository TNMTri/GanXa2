var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
router.get('/', function (req, res) {
    var store_id;
    if (req.param("id")) {
        store_id = req.param("id");
    } else {
        store_id = req.session.store_id;
    }
    req.session.store_id_recent = store_id;
    if (store_id) {
        store_schema.store.find({_id: store_id}, function (store_error, store_array) {
            req.session.store_array = store_array;
            var query_product = product_schema.product.find({"id_store": store_id});
            query_product.limit(10);
            query_product.sort({date: -1});
            query_product.exec(function (product_error, product_array) {
                if (product_array && product_array.length > 0) {
                    res.render('store_detail', {store_id: store_id, store_array: store_array, industry_array: req.session.industry_array, product_array: product_array});
                } else {
                    res.render("store_detail", {store_id: store_id, industry_array: req.session.industry_array, store_array: store_array, product_array: product_array, product_notification: "Không có sản phẩm tồn tại."});
                }
            });
        });
    } else {
        res.render('index', {industry_array: req.session.industry_array, store_array: req.session.store_array});
    }
});

router.post('/', function (req, res) {

});

module.exports = router;