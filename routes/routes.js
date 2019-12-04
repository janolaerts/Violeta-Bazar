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
  new Cart({
    name: req.query.name,
    price: req.query.price,
    img: req.query.img,
    id: req.query._id
  }).save().then(item => console.log(item));
})

module.exports = router;