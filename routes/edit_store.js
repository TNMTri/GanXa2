var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');
var industry_schema = require('../models/industry_schema');

var cover;
var logo;
var im = require('imagemagick');

router.get('/', function (req, res) {

    var store_id = req.param('id');

    store_schema.store.find({_id: store_id}, function (store_error, store_array) {
        if (!store_error && store_array && store_array.length > 0) {
            product_schema.product.find({IDStore: store_id}, function (product_error, product_array) {
                store_array.forEach(function (store) {
                    industry_schema.industry.find(function (industry_error, industry_array) {
                        cover = store.cover;
                        logo = store.logo;
                        req.session.industry_array = industry_array;
                        res.render('edit_store', {store_array: store_array, product_array: product_array, store_id: store_id, industry_array: industry_array});
                    });
                });
            })
        }
    });
});

router.post('/', function (req, res) {

    var store_id = req.param('id');
    var store_name = req.body.txtStoreName;

    var count_address = 1; //req.body.txtCountAddress;
    var address = [];
    for (var i = 1; i < count_address.length; i++) {
        var city = req.body.txtCity + i;
        var district = req.body.txtDistrict + i;
        var street = req.body.txtStreet + i;
        address.push({"city": city, "district": district, "street": street});
    }

    var latitude = req.body.txtLatitude;
    var longitude = req.body.txtLongitude;
    var phone = req.body.txtPhone;
    var description = req.body.txtDescription;
    var industry = req.body.slcIndustry;
    var hours_of_work = req.body.txtHoursOfWork;
    var website = req.body.txtWebsite;
    var fanpage = req.body.txtFanpage;

    //Cover:
    var cover_new = cover;
    if (typeof req.files.ulfCover != 'undefined') {
        var cover_upload_path = req.files.ulfCover.path;
        var cover_save_path = "public/images/" + req.files.ulfCover.name;
        im.identify(cover_upload_path, function (cover_error, cover_features) {
            if (cover_features) {
                im.resize({
                    srcPath: cover_upload_path,
                    dstPath: cover_save_path,
                    width: cover_features.width / 2,
                    height: cover_features.height / 2
                }, function (err, stdout, stderr) {
                });
            }
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
        im.identify(logo_upload_path, function (logo_error, logo_features) {
            if (logo_features) {
                im.resize({
                    srcPath: logo_upload_path,
                    dstPath: logo_save_path,
                    width: logo_features.width / 2,
                    height: logo_features.height / 2
                }, function (err, stdout, stderr) {
                });
            }
        });
        logo_save_path = ".." + req.files.ulfLogo.path.replace("public", "");
        logo_new = logo_save_path;
    }
    console.log(logo_new);

    store_schema.store.update({_id: store_id}, {$set: {store_name: store_name, address: address, latitude: latitude, longitude: longitude, phone: phone, description: description, industry: industry, hours_of_work: hours_of_work, cover: cover_new, logo: logo_new, website: website, fanpage: fanpage}}, function (error, result) {
        if (!error && result) {
            store_schema.store.find(function (store_error, store_array) {
                res.render('home', {store_array: store_array});
            })
        } else {
            console.log(error);
        }
    });
});
module.exports = router;