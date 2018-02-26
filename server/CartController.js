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

// function deleteCartItems(session, callback) {
//     let authData = session.auth;
//     if(!authData){
//         return callback('SESSION missed');
//     }
//
//     bl.cart.deleteCartItems(function(err, deleteAllFromCartResult) {
//         if (err) {
//             return callback(err);
//         }
//         callback(null, deleteAllFromCartResult);
//     })
// }

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

function getCartItems(session, callback) {
    let authData = session.auth;
    let cartId = session.cart;
    if(!authData || !cartId){
        return callback('SESSION missed');
    }
  //  let tz = authData['user']['teudat_zehut'];
    bl.cart.getCartItems(cartId, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    })
}

module.exports.AddToCart = addToCart;
module.exports.DeleteFromCart = deleteFromCart;
//module.exports.DeleteCartItems = deleteCartItems;
module.exports.GetCart = getCart;
module.exports.GetCartItems = getCartItems;