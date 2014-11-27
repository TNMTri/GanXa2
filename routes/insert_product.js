edit_product.jsvar
express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
var industry_schema = require('../models/industry_schema');

var store_id;

router.get('/', function (req, res) {

    store_id = req.param('id');
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
    var strTags = req.body.product_tags;
    var Tags = strTags.split(",");
    for (i = 0; i < Tags.length; i++) {
        Tags[i] = Tags[i].trim();
    }
    var description = req.body.txtDescription;

    //Media
    /*var media = [];
    req.files.product_image.forEach(function (file, i) {
        //Images.push(".." + file.path.replace("public", ""));
        var path = file.path;
        var image = "public/images/" + file.name;
        var im = require('imagemagick');
        im.resize({
            srcPath: path,
            dstPath: image,
            width: 500
        }, function (err, stdout, stderr) {
            console.log('Resize success.');
        });
        Images.push(".." + file.path.replace("public", ""));
    });*/
    var Rating;

    new products_schema.product({
        _id: null,
        id_store: id_store,
        product_name: product_name,
        price: price,
        tags: Tags,
        description: description,
        media: [],
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
});

module.exports = router;