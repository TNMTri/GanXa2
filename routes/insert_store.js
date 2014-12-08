var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var industry_schema = require('../models/industry_schema');

router.get('/', function (req, res) {
    res.render('insert_store', {industry_array: req.session.industry_array});
});

router.post('/', function (req, res) {
    var id_user_facebook = "id_user_facebook";
    var store_name = req.body.txtStoreName;
    //Xử lý address:
    //var count_address = req.body.txtCountAddress;
    var address = [];
    //for (var i = 1; i <= count_address.length; i++) {
    var city = req.body.txtCity;
    var district = req.body.txtDistrict;
    var street = req.body.txtStreet;
    var room = req.body.txtRoom;
    address.push({"city": city, "district": district, "street": street, "room":room});
    //}
    var latitude = req.body.txtLatitude;
    var longitude = req.body.txtLongitude;
    var phone = req.body.txtPhone;
    var description = req.body.txtDescription;
    var industry = req.body.slcIndustry;
    var hours_of_work = req.body.txtHoursOfWork;
    var website = req.body.txtWebsite;
    var fanpage = req.body.txtFanpage;

    //Lấy hình, resize và chỉnh path:
    var im = require('imagemagick');
    //Path upload:
    var cover_upload_path = req.files.ulfCover.path;
    var logo_upload_path = req.files.ulfLogo.path;
    //Path save:
    var cover_save_path = "public/images/" + req.files.ulfCover.name;
    var logo_save_path = "public/images/" + req.files.ulfLogo.name;
    //Resize:
    //Cũ
    /*im.resize({
        srcPath: cover_upload_path,
        dstPath: cover_save_path,
        width: 800
    }, function (err, stdout, stderr) {
        if (err) throw err;
        console.log('Resized cover successful.');
    });*/
    //Crop
    var option={
        srcPath: cover_upload_path,
        dstPath: cover_save_path,
        width: 1100,
        height: 350,
        quality: 1,
        gravity: "Center"
    };
    im.crop(option, function (err, stdout, stderr) {
        if (err) throw err;
        console.log('Resized cover successful.');
    });



    im.resize({
        srcPath: logo_upload_path,
        dstPath: logo_save_path,
        width: 500
    }, function (err, stdout, stderr) {
        if (err) throw err;
        console.log('Resized logo successful.');
    });
    //Xử lý path save:
    cover_save_path = ".." + cover_save_path.replace("public", "");
    logo_save_path = ".." + logo_save_path.replace("public", "");

    var date = new Date();
    new store_schema.store({
        _id: null,
        id_user_facebook: id_user_facebook,
        store_name: store_name,
        address: address,
        latitude: latitude,
        longitude: longitude,
        phone: phone,
        description: description,
        industry: industry,
        hours_of_work: hours_of_work,
        website: website,
        fanpage: fanpage,
        cover: cover_save_path,
        logo: logo_save_path,
        date: date
    }).save(function (error) {
            var query_store = store_schema.store.find({});
            query_store.limit(8);
            query_store.sort({date: -1});
            query_store.exec(function (store_error, store_array) {
                if (store_array && store_array.length > 0) {
                    req.session.store_array = store_array;

                    industry_schema.industry.find(function (industry_error, industry_array) {
                        if (industry_array && industry_array.length > 0) {
                            req.session.store_array = store_array;
                            req.session.industry_array = industry_array;
                            res.render('index', {store_array: store_array, industry_array: industry_array});
                        } else {
                            console.log(industry_error);
                        }
                    });
                } else {
                    console.log(store_error);
                }
            });
        });
});

module.exports = router;