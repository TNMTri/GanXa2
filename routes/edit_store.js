var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
var industry_schema = require('../models/industry_schema');

var cover;
var logo;
router.get('/', function (req, res) {

    var store_id = req.param('id');

    store_schema.store.find({_id: store_id}, function (store_error, store_array) {
        if (!store_error && store_array && store_array.length > 0) {
            product_schema.product.find({IDStore: store_id}, function (product_error, product_array) {
                store_array.forEach(function (store) {
                    cover = store.cover;
                    logo = store.logo;
                    res.render('edit_store', {store_array: store_array, product_array: product_array, store_id: store_id, industry_array: req.session.industry_array});
                });
            })
        }
    });
});

router.post('/', function (req, res) {

    var store_id = req.param('id');
    var store_name = req.body.txtStoreName;

    var address = [];
    var city = req.body.txtCity;
    var district = req.body.txtDistrict;
    var street = req.body.txtStreet;
    var room = req.body.txtRoom;
    address.push({"city": city, "district": district, "street": street, "room": room});


    var latitude = req.body.txtLatitude;
    var longitude = req.body.txtLongitude;
    var phone = req.body.txtPhone;
    var description = req.body.txtDescription;
    var industry = req.body.slcIndustry;
    var hours_of_work = req.body.txtHoursOfWork;
    var website = req.body.txtWebsite;
    var fanpage = req.body.txtFanpage;

    var im = require('imagemagick');
    //Cover:
    var cover_new = cover;
    if (typeof req.files.ulfCover != 'undefined') {
        var cover_upload_path = req.files.ulfCover.path;
        var cover_save_path = "public/images/" + req.files.ulfCover.name;
        /*im.resize({
         srcPath: cover_upload_path,
         dstPath: cover_save_path,
         width: 800
         }, function (err, stdout, stderr) {
         if (err) throw err;
         console.log('Resized cover successful.');
         });*/
        var option = {
            srcPath: cover_upload_path,
            dstPath: cover_save_path,
            width: 1100,
            height: 400,
            quality: 1,
            gravity: "Center"
        };
        im.crop(option, function (err, stdout, stderr) {
            if (err) throw err;
            console.log('Resized cover successful.');
        });
        cover_save_path = ".." + req.files.ulfCover.path.replace("public", "");
        cover_new = cover_save_path;
    }
    console.log(cover_new);
    //Logo:
    var logo_new = logo;
    if (typeof req.files.ulfLogo != 'undefined') {
        var logo_upload_path = req.files.ulfLogo.path;
        var logo_save_path = "public/images/" + req.files.ulfLogo.name;
        im.resize({
            srcPath: logo_upload_path,
            dstPath: logo_save_path,
            width: 500
        }, function (err, stdout, stderr) {
            if (err) throw err;
            console.log('Resized logo successful.');
        });
        logo_save_path = ".." + req.files.ulfLogo.path.replace("public", "");
        logo_new = logo_save_path;
    }
    console.log(logo_new);

    store_schema.store.update({_id: store_id}, {$set: {store_name: store_name, address: address, latitude: latitude, longitude: longitude, phone: phone, description: description, industry: industry, hours_of_work: hours_of_work, cover: cover_new, logo: logo_new, website: website, fanpage: fanpage}}, function (error, result) {
        if (!error && result) {
            var query_store = store_schema.store.find({"_id": store_id});
            query_store.limit(8);
            query_store.sort({date: -1});
            query_store.exec(function (store_error, store_array) {
                if (store_array && store_array.length > 0) {
                    var query_product = product_schema.product.find({"id_store": store_id});
                    query_product.limit(10);
                    query_product.sort({date: -1});
                    query_product.exec(function (product_error, product_array) {
                        if (product_array && product_array.length > 0) {
                            res.render('store_detail', {store_id: store_id, store_array: store_array, industry_array: req.session.industry_array, product_array: product_array});
                        } else {
                            res.render("store_detail", {store_id: store_id, industry_array: req.session.industry_array, store_array: store_array, product_array: product_array, product_notification: "Không có sản phẩm tồn tại."});
                        }
                    });
                } else {
                    console.log(store_error);
                }
            });
        } else {
            console.log(error);
        }
    });
});
module.exports = router;