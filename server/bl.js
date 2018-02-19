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
                    [params.teudat_zehut, params.name, params.last_name, params.email, md5(params.password), params.city, params.street, params.role],
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
                callback('User already exists');
             //   console.log("User already exists");
            }
        });
}

function getFruits(params, callback) {
    dal.executeQuery('SELECT * FROM `products` WHERE category = ?', [params.category], function(err, rows) {
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

function editFruit(params, callback){
   // console.log('edit item: ',params);
    let arrValues = [params.name, params.category, params.price, params.id];
    let imgStr = '';
    if(params.image){
        imgStr = ', image = ?';
        arrValues.splice(-1, 0, params.image);
    }
    dal.executeQuery('UPDATE `products` SET name = ? , category = ?, price = ? ' + imgStr + ' WHERE id = ?', arrValues, function(err, res, rows) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
        // console.log(res.affectedRows + " record(s) updated");
    });
}

function addFruit(params, callback){
    console.log('add item: ', params);
    dal.executeQuery('INSERT INTO `products` (id, name, category, price) VALUES (NULL,?,?,?)',
        [params.name, params.category, params.price],
        function(err, rows) {
            if (err) {
                console.log('error sql', err);
                return callback('Register error');
            }
            let addFruitModel = new models.Fruit(params);
            callback(null, addFruitModel);
        });
}

function getUserCart(tz, callback){
    dal.executeQuery('SELECT carts.id FROM carts LEFT JOIN orders ON carts.id = orders.cart WHERE carts.customer = ? AND orders.id IS NULL',
        [tz], function(err, rows) {
        if (err) {
            callback(err);
        } else{
            let cartId = 0;
            if(rows && rows.length){
                let cartRow = rows[0];
                cartId = cartRow.id;
            }
            callback(null,cartId);
        }
    });

}
function addToCart(params, callback) {
    var p1 = new Promise(function(resolve, reject){
        getUserCart(params.tz, function(err,data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    p1.then(function(cartId) {
        if(!cartId){
            dal.executeQuery('INSERT INTO `carts` (id, customer, creation_date) VALUES (NULL, ?, NOW())', [params.tz], function(err, res) {
                if (err) {
                    callback(err);
                } else {
                    addCartItem(res.insertId, params, callback);
                }
            });
        } else {
            addCartItem(cartId, params, callback);
        }
    }, function(err){callback(err);});
}

function addCartItem(cartId, params, callback){
    dal.executeQuery('INSERT INTO `cart_items` (id, product, quantity, price, cart) VALUES (NULL,?,?,?,?)',
        [params.product, params.quantity, params.price, cartId],
        function(err, res) {
            if (err) {
                console.log('error sql', err);
                return callback('Adding cart item error');
            }
            params.id = res.insertId;
            params.cart = cartId;
            let cartItemModel = new models.CartItem(params);
            callback(null, cartItemModel);
        });
            console.log(params);
}

function deleteCartItem(params, callback){
 //   console.log('delete item: ',params);
    dal.executeQuery('DELETE FROM `cart_items` WHERE id = ?', [params.id], function(err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null,params.id);
        }
    //    console.log('Deleted Row(s):', res.affectedRows);
    });
}

function getCartData(tz, callback){
    var p1 = new Promise(function(resolve, reject){
        getUserCart(tz, function(err,data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    p1.then(function(cartId) {
        if(!cartId){
            callback(null, 0);
        } else {
            getCartItems(cartId, callback);
        }
    }, function(err){callback(err);});
}

function getCartItems(cartId, callback){
    dal.executeQuery(`SELECT ci.*, p.name
                        FROM cart_items ci
                        INNER JOIN products p ON ci.product = p.id
                        WHERE ci.cart = ?`, [cartId], function(err, rows) {
        if (err) {
            callback(err);
        }

        const cartItemsArray = [];
        rows.forEach(function (row) {
            cartItemsArray.push(new models.CartItem(row));
        });
        callback(null, cartItemsArray);
    });
  //   callback(null, [{product:5, quantity:1, price: 10}, {product:7, quantity:2, price: 25}]);

}

function getCategories(params, callback) {
    dal.executeQuery('SELECT * FROM `categories`', [], function(err, rows) {
        if (err) {
            callback(err);
        }

        const categoriesObjectsArray = [];
        rows.forEach(function (row) {
            categoriesObjectsArray.push(new models.Category(row));
        });
        callback(null, categoriesObjectsArray);
      //  console.log(categoriesObjectsArray);
    });
}

function order(tz, cartId, params, callback){
    dal.executeQuery('INSERT INTO `cart_items` (id, customer, cart, price, delivery_city, delivery_street, delivery_date, order_date, credit_card) VALUES (NULL,?,?,?,?,?,?, NOW(), ?)',
        [params.tz, cartId, params.price, params.delivery_city, params.delivery_street, params.delivery_date, params.credit_card],
        function(err, res) {
            if (err) {
                console.log('error sql', err);
                return callback('Order error');
            }
            params.id = res.insertId;
            params.cart = cartId;
            let orderItemModel = new models.Order(params);
            callback(null, orderItemModel);
        });
    console.log(params);
}

module.exports.fruits = {
    getFruits: getFruits,
    editFruit: editFruit,
    addFruit: addFruit,
    getCategories: getCategories
};


module.exports.auth = {
    login: login,
    register: register
};


module.exports.cart = {
    addToCart: addToCart,
    deleteFromCart: deleteCartItem,
    getCart: getCartData,
    order: order
};