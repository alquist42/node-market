function Egg(egg) {
    this.id = egg['id'];
    this.image= egg['image'];
    this.name = egg['name'];
    this.price= egg['price'];
}

function Fruit(fruit) {
    this.id = fruit['id'];
    this.image= fruit['image'];
    this.name = fruit['name'];
    this.price= fruit['price'];
}

function Fish(fish) {
    this.id = fish['id'];
    this.image= fish['image'];
    this.name = fish['name'];
    this.price= fish['price'];
}

function Drink(drink) {
    this.id = drink['id'];
    this.image= drink['image'];
    this.name = drink['name'];
    this.price= drink['price'];
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

module.exports.Egg = Egg;
module.exports.Fruit = Fruit;
module.exports.Fish = Fish;
module.exports.Drink = Drink;
module.exports.User = User;