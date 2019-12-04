const router = require('express').Router();
const Cart = require('../mongodb/cart-model');

router.get('/about', (req, res) => {
  res.render('about');
})

router.get('/contact', (req, res) => {
  res.render('contact');
})

router.get('/products', (req, res) => {
  res.render('product-details', { product: req.query });
})

router.get('/add-to-cart', (req, res) => {
  new Cart(req.query);
})

module.exports = router;