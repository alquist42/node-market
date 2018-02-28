var bl = require('./bl');

// CRUD

function order(params, session, callback) {
    let authData = session.auth;
    params.tz = authData['user']['teudat_zehut'];
    bl.orders.order(params, function(err, orderResult) {
        if (err) {
            return callback(err);
        }
        callback(null, orderResult);
    })
}

function ordersCount(callback) {
    bl.orders.getOrdersCount(function(err, fruitArray) {
        if (err) {
            callback(err);
        }

        callback(null, fruitArray);
    })
}

module.exports.Order = order;
module.exports.OrdersCount = ordersCount;