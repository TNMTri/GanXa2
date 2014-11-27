var mongoose = require('mongoose');
var schema = mongoose.Schema;
var object_id = schema.ObjectId;

var product_schema = new schema({
    _id: object_id,
    id_store: String,
    product_name: String,
    price: String,
    tags: [],
    description: String,
    media: [],
    status: Boolean,
    rating: []
});

var product = mongoose.model('products', product_schema);
module.exports = {product: product};