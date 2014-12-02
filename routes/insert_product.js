express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');
var store_schema = require('../models/product_schema');

var store_id;

router.get('/', function (req, res) {

    store_id = req.param('id');
    req.session.store_id_recent = store_id;
    product_schema.product.find({id_store: store_id}, function (product_error, product_array) {
        res.render('insert_product', {product_array: product_array, industry_array: req.session.industry_array, store_id: store_id, insert_product_notification: "Thêm sản phẩm thành công."});
    });
});

router.post('/', function (req, res) {

    var id_store = req.session.store_id_recent;
    var product_name = req.body.txtProductName;
    var price = req.body.txtPrice;
    //Tags:
    var string_tags = req.body.txtTags;
    var tags = string_tags.split(",");
    for (i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
    }
    var description = req.body.txtDescription;

    //Media
    address.push({"city": city, "district": district, "address1": address1, "address2": address2});


    var count = req.body.txtCountMedia;
    var media = [];
    for (i = 1; i <= count; i++) {
        var media_name = req.body.txtMediaName + i;
        //Nếu không upload hình:
        if (req.files.ulfMedia + i === 'undefined' && req.body.txtMediaUrl + i != "") {
            var media_url = req.body.txtMediaUrl + i;
            media.push({"name": media_name, "url": media_url});
        } else if (req.files.ulfMedia + i && req.body.txtMediaUrl +i == "") {
            //Còn nếu có
            var media_upload = req.files.ulfMedia + i;
            var media_upload_path = media_upload.path;
            var media_save_path = "public/images/" + media_upload.name;
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
            media.push({"name": media_name, "url": ".." + media_save_path.replace("public", "")});
        }
    }
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
                store_schema.store.find(function (store_error, store_array) {
                    if (store_array && store_array.length > 0) {
                        req.session.store_array = store_array;
                        product_schema.product.find({id_store: req.session.store_id_recent}, function (product_error, product_array) {
                            res.render("store_detail", {store_id: req.session.store_id_recent, industry_array: req.session.industry_array, store_array: store_array, product_array: product_array});
                        });
                    } else {
                        console.log(store_error);
                    }
                });
            } else {
                console.log(save_error);
            }
        });
});

module.exports = router;