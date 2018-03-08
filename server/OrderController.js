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

function getDeliveryDates(callback) {
    bl.orders.getDeliveryDates(function(err, deliveryDatesArray) {
        if (err) {
            callback(err);
        }

        callback(null, deliveryDatesArray);
    })
}

module.exports.Order = order;
module.exports.OrdersCount = ordersCount;
module.exports.GetDeliveryDates = getDeliveryDates;