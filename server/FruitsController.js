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

function editFruit(params, callback) {

    bl.fruits.editFruit(params, function(err, fruitEditArray) {
        if (err) {
            callback(err);
        }

        callback(null, fruitEditArray);
    })
}

module.exports.Read = read;
module.exports.EditFruit = editFruit;