var express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');
var industry_schema = require('../models/industry_schema');

var media = [];

router.get('/', function (req, res) {
    if (req.param('id')) {
        var id = req.param('id');
        product_schema.product.find({_id: id}, function (product_error, product_array) {
            if (product_array && product_array.length > 0) {
                industry_schema.industry.find(function (industry_error, industry_array) {
                    req.session.industry_array = industry_array;
                    res.render('edit_product', {product_array: product_array, industry_array: industry_array});
                    product_array.forEach(function (p) {
                        media = product_array.media;
                    });
                });
            } else {
                console.log("Lỗi - edit_product.js");
            }
        });
    } else {
        res.render('home');
    }
});

router.post('/', function (req, res) {

    var product_id = req.param('id');
    var product_name = req.body.txtProductName;
    var price = req.body.txtPrice;
    //Tags
    var strTags = req.body.product_tags;
    var tags = strTags.split(",");
    for (i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
    }
    var description = req.body.txtDescription;

    //Media
    var count = req.body.txtCount;
    var media = [];
    for (i = 1; i <= count; i++) {
        var media_name = req.body.txtMediaName + i;
        //Nếu không upload hình:
        if (req.files.ulfMedia === 'undefined' && req.body.txtMediaUrl != "") {
            var media_url = req.body.txtMediaUrl + i;
            media.push({Name: media_name, Url: media_url});
        } else if (req.files.ulfMedia && req.body.txtMediaUrl == "") {
            //Còn nếu có
            var media_upload = req.files.ulfMedia + i;
            var media_upload_path = media_upload.path;
            var media_save_path = "public/images/" + media_upload.name;
            var im = require('imagemagick');
            im.resize({
                srcPath: media_upload_path,
                dstPath: media_save_path,
                width: 600
            }, function (err, stdout, stderr) {
                console.log('Resize product media success.');
            });
            media.push({Name: media_name, Url: ".." + media_save_path.replace("public", "")});
        }
    }

    product_schema.product.update({_id: product_id}, {$set: {product_name: product_name, price: price, tags: tags, description: description, media: media}}, function (err, result) {
        if (!err && result) {
            console.log(req.session.recent_store_id);
            product_schema.product.find({id_store: req.session.recent_store_id}, function (product_error, product_array) {
                res.render('product', {product_array: product_array, store_id: req.session.recent_store_id});
            });
        } else {
            console.log(err);
        }
    });
});
module.exports = router;