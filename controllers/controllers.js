var industry_schema = require('../models/industry_schema');
var store_schema = require('../models/store_schema');
var product_schema = require('../models/product_schema');


var controllers = {

    get_industry_array: function (req, res) {
        var query_industry = industry_schema.industry.find({});
        query_industry.sort({industry_name: 1});
        query_industry.exec(function (industry_error, industry_array) {
            if (industry_array && industry_array.length > 0) {
                req.session.industry_array = industry_array;
                console.log("get all" + req.session.industry_array);
            } else {
                console.log(industry_error);
            }
        });
    },

    get_all: function (req, res) {
        var query_industry = industry_schema.industry.find({});
        query_industry.sort({industry_name: 1});
        query_industry.exec(function (industry_error, industry_array) {
            if (industry_array && industry_array.length > 0) {
                req.session.industry_array = industry_array;
                console.log("get all" + req.session.industry_array);
            } else {
                console.log(industry_error);
            }
        });

        var query_store = store_schema.store.find({});
        query_store.limit(8);
        query_store.sort({date: -1});
        query_store.exec(function (store_error, store_array) {
            if (store_array && store_array.length > 0) {
                req.session.store_array = store_array;
            } else {
                console.log(store_error);
            }
        });

        var query_product = product_schema.product.find({});
        query_product.sort({date: -1});
        query_product.exec(function (product_error, product_array) {
            if (product_array && product_array.length > 0) {
                req.session.industry_array = product_array;
            } else {
                console.log(product_error);
            }
        });
        console.log("end get all" + req.session.industry_array);
    },

    find_store_by_id: function (req, res) {
        var store_id;
        if (req.param("id")) {
            store_id = req.param("id");
        } else {
            store_id = req.session.store_id;
        }
        var query_store = store_schema.store.find({_id: store_id});
        query_store.sort({date: -1});
        query_store.exec(function (store_error, store_array) {
            return store_array;
        })
    },

    find_product_by_id: function (req, res) {
        var product_id;
        if (req.param("id")) {
            product_id = req.param("id");
        } else {
            product_id = req.session.product_id;
        }
        var query_product = product_schema.product.find({_id: product_id});
        query_product.sort({date: -1});
        query_product.exec(function (product_error, product_array) {
            return product_array;
        })
    },

    get_index: function (req, res) {

        var query_store = store_schema.store.find({});
        query_store.limit(8);
        query_store.sort({date: -1});
        query_store.exec(function (store_error, store_array) {
            if (store_array && store_array.length > 0) {
                req.session.store_array = store_array;
                var query_industry = industry_schema.industry.find({});
                query_industry.sort({industry_name: 1});
                query_industry.exec(function (industry_error, industry_array) {
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
        })
    },

    get_store_detail: function (req, res) {
        var store_id;
        if (req.param("id")) {
            store_id = req.param("id");
        } else {
            store_id = req.session.store_id;
        }
        req.session.store_id_recent = store_id;
        if (store_id) {
            store_schema.store.find({_id: store_id}, function (store_error, store_array) {
                req.session.store_array = store_array;
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
            });
        } else {
            res.render('index', {industry_array: req.session.industry_array, store_array: req.session.store_array});
        }
    },

    get_insert_store: function (req, res) {
        var query_industry = industry_schema.industry.find({});
        query_industry.sort({industry_name: 1});
        query_industry.exec(function (industry_error, industry_array) {
            if (industry_array && industry_array.length > 0) {
                req.session.industry_array = industry_array;
                res.render('insert_store', {industry_array: req.session.industry_array});
            } else {
                console.log(industry_error);
            }
        });
    },

    post_insert_store: function (req, res) {
        var id_user_facebook = "id_user_facebook";
        var store_name = req.body.txtStoreName;
        //Xử lý address:
        //var count_address = req.body.txtCountAddress;
        var address = [];
        //for (var i = 1; i <= count_address.length; i++) {
        var city = req.body.txtCity;
        var district = req.body.txtDistrict;
        var street = req.body.txtStreet;
        address.push({"city": city, "district": district, "street": street});
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
        var option = {
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
    },

    get_edit_store: function (req, res) {
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
    },

    post_edit_store: function (req, res) {
        var store_id = req.param('id');
        var store_name = req.body.txtStoreName;

        //var count_address = 1; //req.body.txtCountAddress;
        var address = [];
        //for (var i = 1; i < count_address.length; i++) {
        var city = req.body.txtCity;
        var district = req.body.txtDistrict;
        var street = req.body.txtStreet;
        address.push({"city": city, "district": district, "street": street});
        //}

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
    },

    get_insert_product: function (req, res) {
        store_id = req.param('id');
        req.session.store_id_recent = store_id;
        product_schema.product.find({id_store: store_id}, function (product_error, product_array) {
            res.render('insert_product', {product_array: product_array, industry_array: req.session.industry_array, store_id: store_id, insert_product_notification: "Thêm sản phẩm thành công."});
        });
    },

    post_insert_product: function (req, res) {
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
        //var count_media = req.body.txtCountMedia;
        var media = [];
        //for (var i = 1; i <= count_media; i++) {
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
        var status = true;
        var date = new Date();
        new product_schema.product({
            _id: null,
            id_store: id_store,
            product_name: product_name,
            price: price,
            tags: tags,
            description: description,
            media: media,
            status: status,
            rating: [],
            date: date
        }).save(function (save_error) {
                if (!save_error) {
                    product_schema.product.find({id_store: store_id}, function (product_error, product_array) {
                        res.render("store_detail", {store_id: store_id, industry_array: req.session.industry_array, product_array: product_array, store_array: req.session.store_array});
                    });
                } else {
                    console.log(save_error);
                }
            });
    },

    get_edit_product: function (req, res) {
        if (req.param('id')) {
            var id = req.param('id');
            product_schema.product.find({_id: id}, function (product_error, product_array) {
                if (product_array && product_array.length > 0) {
                    res.render('edit_product', {product_array: product_array, industry_array: req.session.industry_array});
                    product_array.forEach(function (p) {
                        media = product_array.media;
                    });
                } else {
                    console.log(product_error);
                }
            });
        } else {
            res.render('index');
        }
    },

    post_edit_product: function (req, res) {
        var product_id = req.param('id');
        var product_name = req.body.txtProductName;
        var price = req.body.txtPrice;
        //Tags
        var strTags = req.body.txtTags;
        var tags = strTags.split(",");
        for (i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }
        var description = req.body.txtDescription;

        //Media
        /*var count = req.body.txtCount;
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
         }*/

        product_schema.product.update({_id: product_id}, {$set: {product_name: product_name, price: price, tags: tags, description: description}}, function (err, result) {
            if (!err && result) {
                product_schema.product.find({id_store: req.session.store_id_recent}, function (product_error, product_array) {
                    res.render('store_detail', {product_array: product_array, industry_array: req.session.industry_array, store_id: req.session.store_id_recent});
                });
            } else {
                console.log(err);
            }
        });
    },

    get_insert_industry: function (req, res) {
        var query_industry = industry_schema.industry.find({});
        query_industry.sort({industry_name: 1});
        query_industry.exec(function (industry_error, industry_array) {
            if (industry_array && industry_array.length > 0) {
                req.session.industry_array = industry_array;
                res.render('insert_industry', {industry_array: req.session.industry_array});
            } else {
                console.log(industry_error);
            }
        });
    },

    post_insert_industry: function (req, res) {
        var industry_name = req.body.txtIndustryName;
        new product_schema.product({
            _id: null,
            industry_name: industry_name
        }).save(function (save_error) {
                res.render
            });
    },

    get_search: function (req, res) {
        /*var key = req.param("keyword");
         store_schema.store.find({store_name: {$regex: key, $options: 'i'}}, function (store_error, store_array) {
         console.log(store_array);
         res.render('search', {store_array: store_array, industry_array: req.session.industry_array, notification: "Vừa search store."});
         });*/
        res.render('search', {industry_array: req.session.industry_array});
    },

    post_search: function (req, res) {
        var key;
        if (!req.param("keyword")) {
            key = req.body.txtTextSearch;
        }
        var type = req.body.type;
        if (type == "store") {
            store_schema.store.find({store_name: {$regex: key, $options: 'i, x'}}, function (store_error, store_array) {
                res.render('search', {store_array: store_array, industry_array: req.session.industry_array, notification: "Vừa search store."});
            });
        } else {
            product_schema.product.find({product_name: {$regex: key, $options: 'i, x'}}, function (product_error, product_array) {
                res.render('search', {product_array: product_array, industry_array: req.session.industry_array, notification: "Vừa search product."});
            });
        }
    },

    get_tag: function (req, res) {
        var tag = req.param("tag");

        product_schema.product.find({tags: {$in: [tag]}}, function (product_error, product_array) {
            if (product_array && product_array.length > 0) {
                res.render('tags', {product_array: product_array});
            } else {
                product_schema.product.find(function (product_error, product_array) {
                    res.render('tags', {product_array: product_array, tags_notification: "Không có sản phẩm."});
                })
            }
        });
    }
};

module.exports = function (router) {
    //index
    router.get('/', controllers.get_index);
    //store detail
    router.get('/store_detail', controllers.get_store_detail);
    //insert store
    router.get('/insert_store', controllers.get_insert_store);
    router.post('/insert_store', controllers.post_insert_store);
    //edit store
    router.get('/edit_store', controllers.get_edit_store);
    router.post('/edit_store', controllers.post_edit_store);
    //insert product
    router.get('/insert_product', controllers.get_insert_product);
    router.post('/insert_product', controllers.post_insert_product);
    //edit product
    router.get('/edit_product', controllers.get_edit_product);
    router.post('/edit_product', controllers.post_edit_product);
    //insert industry
    router.get('/insert_industry', controllers.get_insert_industry);
    router.post('/insert_industry', controllers.post_insert_industry);
    //search
    router.get('/search', controllers.get_search);
    router.post('/search', controllers.post_search);
    //tags
    router.get('/tags', controllers.get_tag);
    return router;
};