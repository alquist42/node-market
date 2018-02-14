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

module.exports.Login = login;

module.exports.Register = register;