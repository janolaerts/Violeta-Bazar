const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  client: String,
  products: Array,
  amount: String,
  date: String
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;