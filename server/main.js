var express = require('express');
var bodyParser = require("body-parser");
var fs = require('fs');

// ctrls


var fruitCtrl = require('./FruitsController');
var authCtrl = require('./AuthController');
var cartCtrl = require('./CartController');

var app = express();
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./client'));
app.use(express.static('./node_modules'));

app.use(session({
    secret: 'ssshhhhh',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Express - to serve the client
// body parser - To handle the data of post

// Listen to '/' in GET Verb methods - serve the main Angular index.html file
app.get('/', function (req, res) {
    fs.readFile('./client/index.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }

        res.end(data)
    });

});

app.get('/category', function (req, res) {
    fruitCtrl.Read(req.query, function(err, fruits) {
        if (err) {
            res.end('error!');
        }
        res.end(JSON.stringify(fruits));
    })

});



// Listen to '/product' in POST Verb methods
 app.post('/product', function (req, res) {
     console.log(req.body); // get the body data of post
     res.end();
 });

app.post('/register', function (req, res) {
    authCtrl.Register(req.query, function(err, user) {
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

app.get('/logged_in', function (req, res) {
    if(req.session && req.session.auth && req.session.auth.user){
        res.end(JSON.stringify(req.session.auth.user));
    } else {
        res.end(JSON.stringify({error:'user is not logged in'}));
    }
});

app.post('/login', function (req, res) {
    authCtrl.Login(req.query, function(err, user) {
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

app.post('/logout', function (req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        res.end(JSON.stringify('logged out'));
    });

});
// TODO
app.post('/fruit/edit', function (req, res) {
       console.log(req.query);
    //   res.end(JSON.stringify(req.query));
});


// TODO
app.post('/cart/add', function (req, res) {

    cartCtrl.AddToCart(req.query, req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding to cart error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });

    cartCtrl.AddCartItem(req.query, req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding cart item error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

app.get('/cart/get', function (req, res) {

    cartCtrl.GetCart(req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding to cart error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });

    cartCtrl.GetCartItems(req.session, function(err, result) {
        if (err) {
            console.log('error', err);
            res.end(JSON.stringify({error:'server adding to cart error'}));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

// Start the server
var server = app.listen(8081, function () {
    console.log('listening to 8081')
})
