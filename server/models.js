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

function Category(category) {
    this.id = category['id'];
    this.name= category['name'];
}

function Order(order) {
    this.id = order['id'];
    this.customer= order['customer'];
    this.cart = order['cart'];
    this.price = order['price'];
    this.delivery_city = order['delivery_city'];
    this.delivery_street= order['delivery_street'];
    this.delivery_date = order['delivery_date'];
    this.order_date= order['order_date'];
    this.credit_card = order['credit_card'];
}

module.exports.Fruit = Fruit;
module.exports.User = User;
module.exports.Cart = Cart;
module.exports.CartItem = CartItem;
module.exports.Category = Category;
module.exports.Order = Order;