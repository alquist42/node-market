var express = require('express'); // to serve the client
var bodyParser = require("body-parser"); // handle the data of post
var fs = require('fs');

// ctrls

var fruitCtrl = require('./FruitsController');
var authCtrl = require('./AuthController');
var cartCtrl = require('./CartController');
var orderCtrl = require('./OrderController');

var app = express();
const session = require('express-session');
const multer  = require('multer'); // FILES UPLOADING

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./client'));
app.use(express.static('./node_modules'));
// app.use(fileUpload());

app.use(session({
    secret: 'ssshhhhh',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));

var apiPrefix = '/shopping/api/';

// Listen to '/' in GET Verb methods - serve the main Angular index.html file
app.get('/', function (req, res) {
    fs.readFile('./client/index.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }

        res.end(data)
    });
});

/******************** PRODUCT ******************************/

app.get(apiPrefix + 'product/findByCategory', function (req, res) {
    fruitCtrl.Read(req.query, req.session, function(err, fruits) {
        if (err) {
            res.end('error!');
        }
        res.end(JSON.stringify(fruits));
    })
});

app.get(apiPrefix + 'product/count', function (req, res) {
    fruitCtrl.ProductsCount(function(err, fruits) {
        if (err) {
            res.end('error!');
        }
        res.end(JSON.stringify(fruits));
    })
});

app.put(apiPrefix + 'product/image', function (req, res) {
    if(!req.session.auth){
        res.end(JSON.stringify({error:'LOGOUT'}));
        return;
    }

    var fileName= '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../client/uploads/')
        },
        filename: function (req, file, cb) {
            fileName = Date.now() + '-' + file.originalname;
            cb(null,  fileName)
        }
    });

    var upload = multer({ storage: storage }).single('image');
    upload(req, res, function(err){
        //  console.log('FILE', req.file);
        if(err){
            console.log(err);
            res.end(JSON.stringify({error:'file upload error'}));
        } else {
            res.end(JSON.stringify({image:fileName}));
        }
    });
});

app.put(apiPrefix + 'product', function (req, res) {
    fruitCtrl.EditFruit(req.body, req.session, function(err, result) {
        if (err) {
            if(err == 'SESSION missed'){
                res.end(JSON.stringify({error:'LOGOUT'}));
            }
            console.log(err);
            res.end(JSON.stringify({error:'server editing product error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

app.post(apiPrefix + 'product', function (req, res) {
    fruitCtrl.AddFruit(req.body, req.session, function(err, result) {
        if (err) {
            if(err == 'SESSION missed'){
                res.end(JSON.stringify({error:'LOGOUT'}));
            }
            //   console.log('error', err);
            res.end(JSON.stringify({error:'server adding product error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

app.get(apiPrefix + 'category', function (req, res) {
    fruitCtrl.GetCategories(req.session, function(err, data) {
        if (err) {
            res.end('error!');
        }
        res.end(JSON.stringify(data));
        // console.log(data);
    })
});

/******************** AUTH ******************************/

app.post(apiPrefix + 'register', function (req, res) {
    authCtrl.Register(req.body, function(err, user) {
        if (err) {
          //  console.log('returned error');
            res.end(JSON.stringify({error:err}));
        }
        if(user && Object.keys(user).length){
            req.session.auth = {
                user:user
            }
            res.end(JSON.stringify(user));
        } else {
            res.end(JSON.stringify({error:'Register error!'}));
        }

    });
});

app.get(apiPrefix + 'logged_in', function (req, res) {
    if(req.session && req.session.auth && req.session.auth.user){
        res.end(JSON.stringify(req.session.auth.user));
    } else {
        res.end(JSON.stringify({error:'user is not logged in'}));
    }
});

app.post(apiPrefix + 'login', function (req, res) {
    authCtrl.Login(req.body, function(err, user) {
        if (err) {
            res.end(JSON.stringify({error:'server login error'}));
        }
        if(user && Object.keys(user).length){
            req.session.auth = {
                user:user
            }
        //    console.log(req.session, req.sessionID);
            res.end(JSON.stringify(user));
        } else {
            res.end(JSON.stringify({error:'login error! Wrong email or password'}));
        }
    })
});

app.get(apiPrefix + 'logout', function (req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        res.end(JSON.stringify('logged out'));
    });
});

/******************** CART SERVICE ******************************/

app.post(apiPrefix + 'cart', function (req, res) {

    cartCtrl.AddToCart(req.body, req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding to cart error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

app.delete(apiPrefix + 'cart', function (req, res) {
    cartCtrl.DeleteFromCart(req.body, req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            if(err == 'SESSION missed'){
                res.end(JSON.stringify({error:'LOGOUT'}));
            }
            res.end(JSON.stringify({error:'server deleting to cart error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

app.get(apiPrefix + 'cart', function (req, res) {
    cartCtrl.GetCart(req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding to cart error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

/******************** ORDER SERVICE ******************************/

app.post(apiPrefix + 'order', function (req, res) {
    orderCtrl.Order(req.body, req.session, function(err, data) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server order error'}));
        } else {
            req.session.cart = data.cart;
            res.end(JSON.stringify(data));
         //   console.log(data);
        }
    });
});

app.get(apiPrefix + 'download', function (req, res) {
    cartCtrl.GetCartItems(req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding to cart error'}));
        } else {
            let text = "Your order:\r\n";
            let totPrice = 0;
            let fruits = result.fruits;
            fruits.forEach(function(product){
                text += "Name: " + product.name + " ";
                text += "Quantity: " + product.quantity + " ";
                text += "Price: " + product.price + "\r\n";
                totPrice += product.price;
            });
            text += "Total price: " + totPrice + "$";
            res.setHeader('Content-type', "application/octet-stream");
            res.setHeader('Content-disposition', 'attachment; filename=order.txt');
            res.send(text);
        }
    });
});

// Start the server
var server = app.listen(8081, function () {
    console.log('listening to 8081')
})
