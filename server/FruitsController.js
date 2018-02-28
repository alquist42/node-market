var bl = require('./bl');

// CRUD
function read(params, session, callback) {
    bl.fruits.getFruits(params, function(err, fruitArray) {
        if (err) {
            callback(err);
        }

        callback(null, fruitArray);
    })
}

function productsCount(callback) {
    bl.fruits.getFruitsCount(function(err, fruitArray) {
        if (err) {
            callback(err);
        }

        callback(null, fruitArray);
    })
}

function editFruit(params, session, callback) {
    bl.fruits.editFruit(params, function(err, fruitEditArray) {
        if (err) {
            callback(err);
        }else {
            callback(null, fruitEditArray);
        }
    })
}

function addFruit(params, session, callback) {
    bl.fruits.addFruit(params, function(err, fruitAddArray) {
        if (err) {
            callback(err);
        }else {
            callback(null, fruitAddArray);
        }
    })
}

function getCategories(session, callback) {
    bl.fruits.getCategories(function(err, categoryArray) {
        if (err) {
            callback(err);
        }

        callback(null, categoryArray);
    })
}

module.exports.Read = read;
module.exports.ProductsCount = productsCount;
module.exports.EditFruit = editFruit;
module.exports.AddFruit = addFruit;
module.exports.GetCategories = getCategories;