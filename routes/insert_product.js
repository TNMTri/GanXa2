express = require('express');
var router = express.Router();

var product_schema = require('../models/product_schema');

var store_id;

router.get('/', function (req, res) {

    store_id = req.param('id');
    req.session.store_id_recent = store_id;
    product_schema.product.find({id_store: store_id}, function (error, product_array) {
        req.session.recent_store_id = store_id;
        res.render('product', {product_array: product_array, store_id: store_id});
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

    new products_schema.product({
        _id: null,
        id_store: id_store,
        product_name: product_name,
        price: price,
        tags: tags,
        description: description,
        media: media,
        status: true,
        rating: []
    }).save(function (err) {
            if (!err) {
                stores_schema.store.find(function (err, arrStore) {
                    if (arrStore && arrStore.length > 0) {
                        req.session.store = arrStore;
                        res.render('home', {store: req.session.store});
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
})
;

module.exports = router;