const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const keys = require('./keys');
const Product = require('./mongodb/products-model');

const app = express();

app.locals = require('./helpers');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', routes);

app.get('/', (req, res) => {
  Product.find().then(products => res.render('shop', { products: products, cart: app.locals.cart, message: '' }));
})

app.get('/cart', (req, res) => {
  res.render('cart', { cart: app.locals.cart });
})

app.listen(3000, () => {
  console.log('app is listening to port 3000');
})

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true },  () => {
  console.log('connected to mongodb');
})