var mongoose = require('mongoose');
var schema = mongoose.Schema;
var object_id = schema.ObjectId;

var store_schema = new schema({
    _id: object_id,
    id_user_facebook: String,
    store_name: String,
    address: [],
    phone: String,
    industry: String,
    tags: [],
    hours_of_work: String,
    website: String,
    fanpage: String,
    description: String,
    cover: String,
    logo: String,
    latitude: String,
    longitude: String
});

var store = mongoose.model('store', store_schema);
module.exports = {store: store};