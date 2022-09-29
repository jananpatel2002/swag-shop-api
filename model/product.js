var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    title: String,
    price: Number,
    likes: {
        type: Number,
        default: 0
    }

}); //Making a strict guideline of what can and cannot be inside each product

module.exports = mongoose.model('Product', product) //product is from above
