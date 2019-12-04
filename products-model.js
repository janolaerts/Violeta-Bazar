const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: Number,
  img: String,
  detailImg: String,
  description: String
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;