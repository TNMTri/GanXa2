var express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');

var store_id;

router.get('/', function (req, res) {

    store_id = req.param('id');
    req.session.store_id_recent = store_id;
    product_schema.product.find({id_store: store_id}, function (product_error, product_array) {
        res.render('insert_product', {product_array: product_array, industry_array: req.session.industry_array, store_id: store_id, insert_product_notification: "Thêm sản phẩm thành công."});
    });
});

router.post('/', function (req, res) {

    var id_store = store_id;
    var product_name = req.body.txtProductName;
    var price = req.body.txtPrice;
    //Tags:
    var string_tags = req.body.txtTags;
    var tags = string_tags.split(",");
    for (i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
    }
    var description = req.body.txtDescription;
    console.log(req.files.ulfMediaUrl.name);
    //Media
    //var count_media = req.body.txtCountMedia;
    var media = [];
    //for (var i = 1; i <= count_media; i++) {
    var media_name = req.body.txtMediaName;
    var media_url;
    if (req.body.txtMediaUrl) {
        media_url = req.body.txtMediaUrl;
        media.push({"media_name": media_name, "media_url": media_url, "media_type": req.body.grpType});
    } else {

        var media_upload_path = req.files.ulfMediaUrl.path;
        var media_save_path = "public/images/" + req.files.ulfMediaUrl.name;
        var im = require('imagemagick');
        im.identify(media_upload_path, function (error, media_features) {
            if (media_features) {
                im.resize({
                    srcPath: media_upload_path,
                    dstPath: media_save_path,
                    width: media_features.width / 2,
                    height: media_features.height / 2
                }, function (err, stdout, stderr) {
                });
            }
        });
        media.push({"media_name": media_name, "media_url": ".." + media_save_path.replace("public", ""), "media_type": req.body.grpType});
    }
    //}
    var status = true;

    new product_schema.product({
        _id: null,
        id_store: id_store,
        product_name: product_name,
        price: price,
        tags: tags,
        description: description,
        media: media,
        status: status,
        rating: []
    }).save(function (save_error) {
            if (!save_error) {
                product_schema.product.find({id_store: store_id}, function (product_error, product_array) {
                    res.render("store_detail", {store_id: store_id, industry_array: req.session.industry_array, product_array: product_array});
                });
            } else {
                console.log(save_error);
            }
        });
});

module.exports = router;