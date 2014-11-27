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
    var address = req.body.txtAddress; //Phải chia nhỏ ra nữa.
    var latitude = req.body.txtLatitude;
    var longitude = req.body.txtLongitude;
    var phone = req.body.txtPhone;
    var description = req.body.txtDescription;
    var industry = req.body.slcIndustry;
    var hours_of_work = req.body.txtHoursOfWork;
    var website = req.body.txtWebsite;
    var fanpage = req.body.txtFanpage;

    //Cover:
    if (typeof req.files.ulfCover === 'undefined') {
        var cover = cover;
    } else {
        var cover_upload_path = req.files.ulfCover.path;
        var cover_save_path = "public/images/" + req.files.ulfCover.name;
        im.resize({
            srcPath: cover_upload_path,
            dstPath: cover_save_path,
            width: 800
        }, function (err, stdout, stderr) {
            console.log('Resize cover success.');
        });
        cover_save_path = ".." + req.files.ulfCover.path.replace("public", "");
        cover = cover_save_path;
    }
    //Logo:
    if (typeof req.files.ulfLogo === 'undefined') {
        var logo = logo;
    } else {
        var logo_upload_path = req.files.ulfLogo.path;
        var logo_save_path = "public/images/" + req.files.ulfLogo.name;
        im.resize({
            srcPath: logo_upload_path,
            dstPath: logo_save_path,
            width: 250
        }, function (err, stdout, stderr) {
            console.log('Resize logo success.');
        });
        logo_save_path = ".." + req.files.ulfLogo.path.replace("public", "");
        cover = logo_save_path;
    }

    store_schema.store.update({_id: store_id}, {$set: {store_name: store_name, address: address, latitude: latitude, longitude: longitude, phone: phone, description: description, industry: industry, hours_of_work: hours_of_work, cover: cover, logo: logo, website: website, fanpage: fanpage}}, function (err, result) {
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