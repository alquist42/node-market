var bl = require('./bl');

// CRUD
function addToCart(params, session, callback) {
    let authData = session.auth;
    console.log(authData);
    let tz = authData['user']['teudat_zehut'];
    console.log(tz);
}

module.exports.AddToCart = addToCart;