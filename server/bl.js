var dal = require('./dal');
var models = require('./models');
var md5 = require('md5');

function login(params, callback) {
  //  console.log(md5(123), md5(params.password));
    dal.executeQuery('SELECT * FROM `users` WHERE email = ? AND password=?', [params.email, md5(params.password) ], function(err, rows) {
        if (err) {
            callback(err);
        }
        let userModel = {};
        if(rows && rows.length){
            userModel = new models.User(rows[0]);
        }
        callback(null, userModel);
    });
}

function register(params, callback) {

    dal.executeQuery('SELECT teudat_zehut FROM `users` WHERE teudat_zehut = ? LIMIT 1', [params.teudat_zehut],
        function(err,rows){
            if(err) {
                console.log('error sql', err);
                return callback('Register error');
            }
            if (!rows.length)
            {
                dal.executeQuery('INSERT INTO `users` (teudat_zehut, name, last_name, email, password, city, street, role) VALUES (?,?,?,?,?,?,?,?)',
                    [params.teudat_zehut, params.name, params.last_name, params.email, md5(params.password), params.city, params.street, params.role ],
                    function(err, rows) {
                        if (err) {
                            console.log('error sql', err);
                            return callback('Register error');
                        }
                        let userRegModel = new models.User(params);
                        callback(null, userRegModel);
                    });
            }
            else
            {
                return callback('User already exists');
             //   console.log("User already exists");
            }
        });
}

function getFruits(params, callback) {
    dal.executeQuery('SELECT * FROM `products` WHERE category = ?',[params.category], function(err, rows) {
        if (err) {
            callback(err);
        }

        const fruitsObjectsArray = [];
        rows.forEach(function (row) {
            fruitsObjectsArray.push(new models.Fruit(row));
        });
        callback(null, fruitsObjectsArray);
    });
}

function addToCart(params, callback) {
    console.log(params);
    // dal.executeQuery('INSERT INTO `carts` (id, customer, creation_date) VALUES (?,?,?)',
    //     [params.id, params.customer, params.creation_date],
    //     function(err, rows) {
    //     if (err) {
    //         console.log('error sql', err);
    //         return callback('Add To Cart Error');
    //     }
    //     let addToCartModel = new models.Cart(params);
    //     callback(null, addToCartModel);
    // });
}



module.exports.fruits = {
    getFruits: getFruits
};


module.exports.auth = {
    login: login,
    register: register
};


module.exports.cart = {
    addToCart: addToCart
};