var express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');

router.get('/', function (req, res) {

    var tag = req.param("tag");

    product_schema.product.find({Tags: {$in: [tag]}}, function (product_error, product_array) {
        if (p && p.length > 0) {
            res.render('tags', {product_array: product_array});
        } else {
            res.render('tags', {tags_notification: "Không có sản phẩm."});
        }
    });
});

module.exports = router;