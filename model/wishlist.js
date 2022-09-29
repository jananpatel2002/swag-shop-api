var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId; //gets the Object Id for furture usage

var wishList = new Schema({
    title: {
        type: String,
        default: "Cool Wish List"
    },
    products: [{
        type: ObjectId,
        ref: 'Product'
    }] // The products in the wishlist will only be identified by ObjectID so we don't have extra duplicate data. The products are being referred to 'Product' which is the export from product.js that includes all the product objects.
});

module.exports = mongoose.model('WishList', wishList); 
