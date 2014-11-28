express = require('express');
var router = express.Router();

var product_schema = require("../models/product_schema");

var id;
router.get('/', function (req, res) {

    id = req.param("id");
    product_schema.product.find({_id: id}, function (product_error, product_array) {
        media = product_array.media;
    });
});

router.post('/', function (req, res) {
    re.render("/");
});

module.exports = router;