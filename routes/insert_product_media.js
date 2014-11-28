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

    var new_media = [];

    var media_name = req.body.txtMediaName;
    //Nếu không upload hình:
    if (req.files.ulfMedia === 'undefined' && req.body.txtMediaUrl != "") {
        var media_url = req.body.txtMediaUrl;
        media.push({Name: media_name, Url: media_url});
    } else if (req.files.ulfMedia && req.body.txtMediaUrl == "") {
        //Còn nếu có
        var media_upload = req.files.ulfMedia;
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
});

module.exports = router;