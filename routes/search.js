var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');

router.get('/', function(req, res) {
    res.render('search', {industry_array: req.session.industry_array});
});

router.post('/', function(req, res) {
    var key = req.body.textsearch;
    var type = req.body.type;
    if (type == "store") {
        store_schema.store.find({store_name: {$regex: key, $options: 'i'}}, function (store_error, store_array) {
            res.render('search', {store_array: store_array, industry_array: req.session.industry_array, notification: "Vừa search store."});
        });
        //Fulltext search (để search không dấu)
        /*var mongoose = require('mongoose');
         var Schema = mongoose.Schema,
         ObjectId = Schema.ObjectId;
         var mongoose = require('mongoose'),
         searchPlugin = require('mongoose-search-plugin');

         var Schema = mongoose.Schema({
         store_name: String,
         descirption: String
         });

         Schema.plugin(searchPlugin, {
         fields: ['store_name', 'description']
         });

         var Model = mongoose.model('stores', Schema);
         Model.search('some query', {title: 1}, {
         conditions: {title: {$exists: true}},
         sort: {title: 1},
         limit: 10
         }, function(err, data) {
         console.log(data.results);
         console.log(data.totalCount);
         });*/
    } else {
        product_schema.product.find({ProductName: {$regex: key, $options: 'i'}}, function (product_error, product_array) {
            res.render('search', {product_array: product_array, industry_array: req.session.industry_array, notification: "Vừa search product."});
        });
    }
});

module.exports = router;