var express = require('express');
var router = express.Router();

var store_schema = require('../models/store_schema');
router.get('/', function(req, res) {

    //Load all store:
    store_schema.store.find(function(err, store_array){
        if(store_array && store_array.length > 0){
            req.session.store = store_array;
            console.log(req.session.store_array);
            res.render('index', {title: "Express"});
        }else{
            res.render('index');
        }
    })
});

module.exports = router;
