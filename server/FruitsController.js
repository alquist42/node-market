var bl = require('./bl');

// CRUD
function read(params,session, callback) {
    if(!session.auth){
        return callback('SESSION missed');
    }
    bl.fruits.getFruits(params, function(err, fruitArray) {
        if (err) {
            callback(err);
        }

        callback(null, fruitArray);
    })
}

function editFruit(params,session, callback) {
    if(!session.auth){
        return callback('SESSION missed');
    }

    bl.fruits.editFruit(params, function(err, fruitEditArray) {
        if (err) {
            callback(err);
        }else {
            callback(null, fruitEditArray);
        }
    })
}

module.exports.Read = read;
module.exports.EditFruit = editFruit;