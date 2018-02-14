var bl = require('./bl');

// CRUD
function addToCart(params, session, callback) {
    let authData = session.auth;
    let tz = authData['user']['teudat_zehut'];
    params.tz = tz;
    // console.log(tz);

    bl.cart.addToCart(params, function(err, addToCartResult) {
        if (err) {
            return callback(err);
        }

        callback(null, addToCartResult);
    })
}

module.exports.AddToCart = addToCart;