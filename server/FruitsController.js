var bl = require('./bl');

// CRUD
function read(params, callback) {

    bl.fruits.getFruits(params, function(err, fruitArray) {
        if (err) {
            callback(err);
        }

        callback(null, fruitArray);
    })
}


module.exports.Read = read;