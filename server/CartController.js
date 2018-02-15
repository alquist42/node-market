var bl = require('./bl');

// CRUD
function addToCart(params, session, callback) {
    let authData = session.auth;
    if(!authData){
        return callback('SESSION missed');
    }
    params.tz = authData['user']['teudat_zehut'];
    bl.cart.addToCart(params, function(err, addToCartResult) {
        if (err) {
            return callback(err);
        }
        callback(null, addToCartResult);
    })
}

function deleteFromCart(params, session, callback) {
    let authData = session.auth;
    if(!authData){
        return callback('SESSION missed');
    }

    bl.cart.deleteFromCart(params, function(err, deleteFromCartResult) {
        if (err) {
            return callback(err);
        }
        callback(null, deleteFromCartResult);
    })
}

function getCart(session, callback) {
    let authData = session.auth;
    if(!authData){
        return callback('SESSION missed');
    }
    let tz = authData['user']['teudat_zehut'];
    bl.cart.getCart(tz, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    })
}

// function getCartItems(session, callback) {
//     let authData = session.auth;
//     if(!authData){
//         return callback('SESSION missed');
//     }
//     let tz = authData['user']['teudat_zehut'];
//     bl.cart.getCartItems(tz, function(err, result) {
//         if (err) {
//             return callback(err);
//         }
//         callback(null, result);
//     })
// }

// function addCartItem(params, session, callback) {
//     let authData = session.auth;
//     if(!authData){
//         return callback('SESSION missed');
//     }
//     params.tz = authData['user']['teudat_zehut'];
//     bl.cart.addCartItem(params, function(err, addCartItemResult) {
//         if (err) {
//             return callback(err);
//         }
//         callback(null, addCartItemResult);
//     })
// }


module.exports.AddToCart = addToCart;
module.exports.DeleteFromCart = deleteFromCart;
module.exports.GetCart = getCart;
//module.exports.GetCartItems = getCartItems;
// module.exports.AddCartItem = addCartItem;