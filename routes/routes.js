const router = require('express').Router();
const Product = require('../mongodb/products-model');
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
  Product.find().then(products => {
    Cart.findOne({name: req.query.name}).then(product => {
      if(product) {
        res.render('shop', { products: products, message: `${req.query.name} ya está en el carrito!` });
        return
      }
      else {
        new Cart({
          name: req.query.name,
          price: req.query.price,
          img: req.query.img,
          id: req.query._id
        }).save().then(item => res.render('shop', { products: products, message: `Añadiste ${req.query.name} al carrito!` }));
      }
    });
  })
})

router.get('/cart', (req, res) => {
  Cart.find().then(items => {
    res.render('cart', { items: items });
  })
})

module.exports = router;