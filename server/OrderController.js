var bl = require('./bl');

// CRUD

function order(params, session, callback) {
    let authData = session.auth;
    if(!authData){
        return callback('SESSION missed');
    }
    params.tz = authData['user']['teudat_zehut'];
    bl.orders.order(params, function(err, orderResult) {
        if (err) {
            return callback(err);
        }
        callback(null, orderResult);
    })
}

function getCity(params, callback) {

    bl.orders.getCity(params, function(err, getCityResult) {
        if (err) {
            callback(err);
        }

        callback(null, getCityResult);
    })
}

module.exports.Order = order;
module.exports.GetCity = getCity;