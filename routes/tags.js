var express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');

router.get('/', function (req, res) {

    var tag = req.param("tag");

    product_schema.product.find({tags: {$in: [tag]}}, function (product_error, product_array) {
        if (product_array && product_array.length > 0) {
            res.render('tags', {product_array: product_array});
        } else {
            product_array.product_array.find(function (product_error, product_array) {
                res.render('tags', {product_array: product_array, tags_notification: "Không có sản phẩm."});
            })
        }
    });
});

module.exports = router;