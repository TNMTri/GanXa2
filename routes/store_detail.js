var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
router.get('/', function (req, res) {
    var store_id;
    if(req.param("id")){
        store_id = req.param("id");
    }else{
        store_id = req.session.store_id;
    }

    if (store_id) {
        store_schema.store.find({_id: store_id}, function (store_error, store_array) {
            product_schema.product.find({id_store: store_id}, function (product_error, product_array) {
                res.render("store_detail", {store_id: store_id, industry_array: req.session.industry_array, store_array: store_array, product_array: product_array});
            });
        });
    } else {
        res.render('index', {industry_array: req.session.industry_array, store_array: req.session.store_array});
    }
});

router.post('/', function (req, res) {

});

module.exports = router;