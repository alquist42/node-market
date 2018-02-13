var bl = require('./bl');

// CRUD
function addToCart(params, session, callback) {
    bl.carts.addToCart(params, function(err, addToCartResult) {
        if (err) {
            callback(err);
        }
        let authData = session.auth;
        console.log(authData);
        let tz = authData['user']['teudat_zehut'];
        console.log(tz);
        callback(null, addToCartResult);
    })
}

module.exports.AddToCart = addToCart;