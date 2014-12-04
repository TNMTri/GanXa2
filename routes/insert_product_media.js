express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');

var media;
var id;

router.get('/', function (req, res) {

    id = req.param("id");
    product_schema.product.find({_id: id}, function (product_error, product_array) {
        media = product_array.media;
    });
});

router.post('/', function (req, res) {

    //Media
    var count_media = req.body.txtCountMedia;
    var media = [];
    for (var i = 1; i <= count_media; i++) {
        var media_name = req.body.txtMediaName;
        var media_url;
        if (req.body.txtMediaUrl != "" && typeof req.files.ulfMediaUrl == "undefined") {
            media_url = req.body.txtMediaUrl;
            media.push({"media_name": media_name, "media_url": media_url, "media_type": req.body.grpType});
        } else {
            var media_upload_path = req.files.ulfMediaUrl.path;
            var media_save_path = "public/images/" + req.files.ulfMediaUrl.name;
            var im = require('imagemagick');
            im.resize({
                srcPath: media_upload_path,
                dstPath: media_save_path,
                width: 600
            }, function (err, stdout, stderr) {
                if (err) throw err;
                console.log('Resized media successful.');
            });
            media.push({"media_name": media_name, "media_url": ".." + media_save_path.replace("public", ""), "media_type": req.body.grpType});
        }
        //}

        media.push(new_media);

        product_schema.product.update({_id: id}, {$set: {media: media}}, function (product_error, product_array) {
            if (!product_error && product_array) {
                product_schema.product.find({id_store: req.session.store_id_recent}, function (product_error, product_array) {
                    res.render('product', {product_array: product_array, store_id: req.session.store_id_recent});
                });
            } else {
                console.log(product_error);
            }
        });
    }
});

module.exports = router;