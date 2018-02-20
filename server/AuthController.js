var bl = require('./bl');

// CRUD
function login(params, callback) {

    bl.auth.login(params, function(err, loginResult) {
        if (err) {
            callback(err);
        }

        callback(null, loginResult);
    })
}

function register(params, callback) {

    bl.auth.register(params, function(err, registerResult) {
        if (err) {
            callback(err);
        }

        callback(null, registerResult);
    })
}

function getCity(params, callback) {

    bl.auth.getCity(params, function(err, getCityResult) {
        if (err) {
            callback(err);
        }

        callback(null, getCityResult);
    })
}

module.exports.Login = login;
module.exports.Register = register;
module.exports.GetCity = getCity;