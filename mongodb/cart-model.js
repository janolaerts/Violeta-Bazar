const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  name: String,
  price: Number,
  img: String,
  detailImg: String,
  description: String
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;