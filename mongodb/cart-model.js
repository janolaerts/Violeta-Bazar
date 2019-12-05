const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  name: String,
  price: Number,
  img: String,
  id: Number,
  quantity: Number
});

const Cart = mongoose.model('cartproduct', cartSchema);

module.exports = Cart;