var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({
                error: "Couldn't save product"
            });
        } else
            response.send(savedProduct);
    });
});

app.get('/product', function (request, response) {

    Product.find({}, function (err, products) { //finding all of the data in the products database. 
        if (err) {
            response.status(500).send({
                error: "Coudn't fetch products"
            })
        } else
            response.send(products) //sending all the products to the user from the database
    })

});

app.get('/wishlist', function (request, response) { //This /wishlist is really important. Everytime the client hits /wishlist , we will find all of the wishlists and populate each ID with the correct data. This way, everything is oraganized and we can quickly fetch useful information. 
    WishList.find({}).populate({
        path: 'products', //this is the path 
        model: 'Product' //model = aka, what we exported it as module.export etc
    }).exec(function (err, wishLists) {

        if (err) {
            response.status(500).send({
                error: "Unable to populate the data"
            });
        } else
            response.send(wishLists);

    })
});

app.post('/wishlist', function (request, response) {

    var wishList = new WishList();
    wishList.title = request.body.title;

    wishList.save(function (err, newWishList) {
        if (err) {
            response.status(500).send({
                error: "Couldn't create wishlist"
            });

        } else
            response.send(newWishList)
    })

});

app.put('/wishlist/product/add', function (request, response) { //updating the wishlist so that we can add a product ID to it.

    Product.findOne({ // it is important that we use findOne because (find) will give us an array. We don't want the whole array of products.
        _id: request.body.productId //id that you enter in postman of a product
    }, function (err, product) { // This second parameter is a function that we created to handle errors and update the WishList if no errors exist.
        if (err) {
            response.status(500).send({
                error: "Couldn't add product to wishlist"
            })

        } else
            WishList.updateOne({
                _id: request.body.wishListId // First parameter is asking which wishlist we should update. the .wishListId will be something that you can enter from postman

            }, {

                $addToSet: {
                    products: product._id //this line says that we are adding the "product's id" to the products array of the WISHLIST. The "product's id" is grabbed from the line "function (err, product). 
                }
            }, function (err, wishList) { //this line is a error handling for the wishlist being created. 

                if (err) {
                    response.status(500).send({
                        error: "Couldn't create wishlist"
                    });

                } else
                    response.send(wishList) //this line will send the updated wishlist, with the the products[] updated with only the ID.
            });
    });

});

app.listen(3000, function () {
    console.log("Swag Shop API running on port 3000...")
});
