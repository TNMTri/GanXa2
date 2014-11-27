var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
var industry_schema = require('../models/industry_schema');

router.get('/', function (req, res) {
    industry_schema.industry.find(function (err, industry_array) {
        req.session.industry_array = industry_array;
        res.render('insert_store', {industry_array: industry_array});
    });
});

router.post('/', function (req, res) {
    var id_user_facebook = "id_user_facebook";
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

    //Lấy hình, resize và chỉnh path:
    //2 path đầu tiên khi vừa upload:
    var cover_upload_path = req.files.ulfCover.path;
    var logo_upload_path = req.files.ulfLogo.path;
    //2 path muốn lưu lại:
    var cover_save_path = "public/images/" + req.files.ulfCover.name;
    var logo_save_path = "public/images/" + req.files.ulfLogo.name;
    var im = require('imagemagick');
    //Resize cover:
    im.resize({
        srcPath: cover_upload_path,
        dstPath: cover_save_path,
        width: 800
    }, function (err, stdout, stderr) {
        console.log('Resize success.');
    });
    //Resize logo:
    im.resize({
        srcPath: logo_upload_path,
        dstPath: logo_save_path,
        width: 250
    }, function (err, stdout, stderr) {
        console.log('Resize success.');
    });
    //Sửa lại path dùng để save:
    cover_save_path = ".." + req.files.ulfCover.path.replace("public", "");
    logo_save_path = ".." + req.files.ulfLogo.path.replace("public", "");

    new store_schema.store({
        _id: null,
        id_user_facebook: id_user_facebook,
        store_name: store_name,
        address: address,
        latitude: latitude,
        longitude: longitude,
        phone: phone,
        description: description,
        industry : industry,
        hours_of_work: hours_of_work,
        website: website,
        fanpage: fanpage,
        store_category: cover_save_path,
        cover_image: logo_save_path
    }).save(function (err) {
            if (!err) {
                store_schema.store.find(function (err, arrStore) {
                    if (arrStore && arrStore.length > 0) {
                        req.session.store = arrStore;
                        res.render('home', {store: req.session.store});
                    } else {
                        res.render('index');
                    }
                });
            }
        });
});

module.exports = router;