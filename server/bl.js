var dal = require('./dal');
var models = require('./models');
var md5 = require('md5');
var luhn = require("luhn"); // luhn algorithm validation
// var Regex = require("regex");

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
    // Registration form fields validation
    var teudat_zehut = String(params.teudat_zehut);
    var is_valid = luhn.validate(teudat_zehut);
    if(!is_valid){
        return callback({message:'Please enter a valid teudat zehut', type: 'validation'});
    }

    // Match the email format through regular expression
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var str = params.email;
    var res = str.match( pattern );
    if(!res){
        return callback({message:'Please enter a valid email', type: 'validation'});
    }

    // Match the password format through regular expression for five or more characters
    var pattern = /^\S{5,}$/;
    var str = params.password;
    var res = str.match( pattern );
    if(!res){
        return callback({message:'Please enter a valid password', type: 'validation'});
    }

    if (isEmpty(params.city) == true) {
        return callback({message:'Please enter a valid city', type: 'validation'});
    }
    if (isEmpty(params.street) == true) {
        return callback({message:'Please enter a valid street', type: 'validation'});
    }
    if (isEmpty(params.name) == true) {
        return callback({message:'Please enter a valid name', type: 'validation'});
    }
    if (isEmpty(params.last_name) == true) {
        return callback({message:'Please enter a valid last name', type: 'validation'});
    }

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
                callback({message:'User already exists', type: 'validation'});
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

function getFruitsCount(callback) {
    dal.executeQuery('SELECT count(id) as count FROM `products` ', [], function(err, rows) {
        if (err) {
            callback(err);
        }

        let count = 0;
        if(rows && rows.length){
            let row = rows[0];
            count = row.count;
        }
        callback(null, count);
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
            callback(null, 'success');
        }
        // console.log(res.affectedRows + " record(s) updated");
    });
}

function addFruit(params, callback){
   // console.log('add item: ', params);
    dal.executeQuery('INSERT INTO `products` (id, name, category, price, image) VALUES (NULL,?,?,?,?)',
        [params.name, params.category, params.price, params.image],
        function(err, res) {
            if (err) {
                console.log('error sql', err);
                return callback('Register error');
            }
            params.id = res.insertId
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
        [params.product, params.quantity, params.price * params.quantity, cartId],
        function(err, res) {
            if (err) {
                console.log('error sql', err);
                return callback('Adding cart item error');
            }
            params.id = res.insertId;
            params.price = params.price * params.quantity;
            params.cart = cartId;
            let cartItemModel = new models.CartItem(params);
            callback(null, cartItemModel);
        });
}

function deleteCartItems(params, callback){
    let values = [];
    let str = '';
    if(params.id){
        values.push(params.id);
        str = ' WHERE id = ?';
    }

    dal.executeQuery('DELETE FROM `cart_items`' + str, values, function(err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, 'success');
        }
    //    console.log('Deleted Row(s):', res.affectedRows);
    });
}

// function deleteCartItems(callback){
//       // console.log('delete items: ', params);
//     dal.executeQuery('DELETE FROM `cart_items`', [], function(err, res) {
//         if (err) {
//             callback(err);
//         } else {
//             callback(null, 'success');
//         }
//            console.log('Deleted Row(s):', res.affectedRows);
//     });
// }

function getCartData(tz, callback){
    var p1 = new Promise(function(resolve, reject){
        getUserCart(tz, function(err, data){
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
        let totalSum = 0;
        rows.forEach(function (row) {
            totalSum += row['price'];
            cartItemsArray.push(new models.CartItem(row));
        });
        callback(null, {fruits:cartItemsArray, cart:cartId, totalSum: totalSum});
    });

}

function getUserHistory(userId, callback){
    dal.executeQuery(`SELECT carts.id AS cart_id, carts.creation_date AS cart_date,
                         (
                        SELECT SUM(price)
                        FROM cart_items
                        WHERE cart = cart_id
                        ) AS total_price
                        FROM carts
                        LEFT JOIN orders o1 ON carts.id = o1.cart
                        WHERE carts.customer = ? AND o1.id IS NULL`,
                        [userId], function(err, rows) {
        if (err) {
            callback(err);
        } else {
            dal.executeQuery(`SELECT MAX(order_date) AS order_date
                                    FROM orders
                                    WHERE customer=? `, [userId], function(err, date) {
                if (err) {
                    callback(err);
                } else {
                    let data = {};
                    if(rows && rows.length){
                        data = rows[0];
                    }

                    if(date && date.length){
                        data.order_date = date[0]['order_date'];
                    }

                    callback(null, data);
                }
            })
        }
    });

}

function getCategories(callback) {
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

// check the given object first if it is a string at all and test for an empty string
function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function order(params, callback){
    // Order form fields validation
    if (isEmpty(params.delivery_city) == true) {
        return callback({message:'Please enter a valid city', type: 'validation'});
    }
    if (isEmpty(params.delivery_street) == true) {
        return callback({message:'Please enter a valid street', type: 'validation'});
    }

    // Match the date format through regular expression for mm-dd-yyyy
    var pattern = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
    var str = params.delivery_date;
    var res = str.match( pattern );
    if(!res){
        return callback({message:'Please enter a valid date', type: 'validation'});
    }

    let d = new Date(params.delivery_date);
    params.delivery_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    var card_value = String(params.credit_card);
    params.credit_card = card_value.substr(card_value.length-4);
    var is_valid = luhn.validate(card_value);
    if(!is_valid){
        return callback({message:'Please enter a valid credit card', type: 'validation'});
    }
   
    dal.executeQuery(`
    INSERT INTO orders (id, customer, cart, price, delivery_city, delivery_street, delivery_date, order_date, credit_card)
    VALUES (
        NULL,?,?,(
                    SELECT SUM(ci.price) AS price
                    FROM cart_items ci
                    WHERE cart = ?
        ),?,?,?, NOW(), ?)`,
        [params.tz, params.cart, params.cart, params.delivery_city, params.delivery_street, params.delivery_date, params.credit_card],
        function(err, res) {
            if (err) {
                console.log('error sql', err);
                return callback('Order error');
            }
            params.id = res.insertId;
            let orderItemModel = new models.Order(params);
            callback(null, orderItemModel);
           // console.log(orderItemModel);
        });
}

function getOrdersCount(callback) {
    dal.executeQuery('SELECT count(id) as count FROM `orders`', [], function(err, rows) {
        if (err) {
            callback(err);
        }

        let count = 0;
        if(rows && rows.length){
            let row = rows[0];
            count = row.count;
        }
        callback(null, count);
    });
}

function getDeliveryDates(callback) {
    dal.executeQuery(`SELECT delivery_date, COUNT(*) FROM orders
                        WHERE delivery_date >= CURDATE()
                        GROUP BY delivery_date 
                        HAVING COUNT(*)>2`,
        [], function(err, rows) {
        if (err) {
            callback(err);
        }

        const deliveryDatesArray = [];
        rows.forEach(function (row) {
            var d = new Date(row['delivery_date']);
            var newDate = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
            deliveryDatesArray.push(newDate);
        });
        callback(null, deliveryDatesArray);
     //   console.log(deliveryDatesArray);
    });
}

module.exports.fruits = {
    getFruits: getFruits,
    getFruitsCount: getFruitsCount,
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
    deleteFromCart: deleteCartItems,
 //   deleteCartItems: deleteCartItems,
    getCart: getCartData,
    getCartItems: getCartItems,
    getUserHistory: getUserHistory
};

module.exports.orders = {
    order: order,
    getOrdersCount: getOrdersCount,
    getDeliveryDates: getDeliveryDates
};