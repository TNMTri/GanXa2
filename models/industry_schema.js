var mongoose = require('mongoose');
var schema = mongoose.Schema;
var object_id = schema.ObjectId;

var industry_schema = new schema({
    _id: object_id,
    category_name: String
});

var product = mongoose.model('industry', industry_schema);
module.exports = {product: product};