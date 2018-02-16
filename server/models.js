function Fruit(fruit) {
    this.id = fruit['id'];
    this.name = fruit['name'];
    this.category= fruit['category'];
    this.price= fruit['price'];
    this.image= fruit['image'];
}

function User(user) {
    this.teudat_zehut = user['teudat_zehut'];
    this.name= user['name'];
    this.last_name = user['last_name'];
    this.email= user['email'];
    this.role= user['role'];
    this.city= user['city'];
    this.street= user['street'];
 //   this.password= user['password'];
}

function Cart(cart) {
    this.id = cart['id'];
    this.customer= cart['customer'];
    this.creation_date = cart['creation_date'];
}

function CartItem(cartItem) {
    this.id = cartItem['id'];
    this.product= cartItem['product'];
    this.quantity = cartItem['quantity'];
    this.price = cartItem['price'];
    this.cart = cartItem['cart'];
    if(cartItem['name']){
        this.name = cartItem['name'];
    }
}

module.exports.Fruit = Fruit;
module.exports.User = User;
module.exports.Cart = Cart;
module.exports.CartItem = CartItem;