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

module.exports.Order = order;