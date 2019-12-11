const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Product = require('./mongodb/products-model');
const stripe = require('stripe')(keys.stripe.secret);
const helpers = require('./helpers');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', routes);

app.get('/', (req, res) => {
  Product.find().then(products => res.render('shop', { products: products, message: null, toShop: false }));
})

app.listen(process.env.PORT || 3000, () => {
  console.log('app is listening to port 3000');
})

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true },  () => {
  console.log('connected to mongodb');
})

mongoose.set('useFindAndModify', false);