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
        res.render('shop', { products: products, message: `${req.query.name.replace('-', ' ')} ya está en el carrito!` });
        return
      }
      else {
        new Cart({
          name: req.query.name,
          price: req.query.price,
          img: req.query.img,
          id: req.query._id,
          quantity: req.query.quantity
        }).save().then(item => res.render('shop', { products: products, message: `Añadiste ${req.query.name.replace('-', ' ')} al carrito!` }));
      }
    });
  })
})

router.get('/cart', (req, res) => {
  Cart.find().then(items => {
    res.render('cart', { products: items });
  })
})

router.get('/add-quantity', (req, res) => {
  Cart.findOneAndUpdate({ name: req.query.name }, { quantity: req.query.quantity })
  .then(Cart.find().then(items => {
    res.redirect('/cart');
  }))
})

router.get('/remove-quantity', (req, res) => {
  Cart.findOneAndUpdate({ name: req.query.name }, { quantity: req.query.quantity })
  .then(Cart.find().then(items => {
    res.redirect('/cart');
  }))
})

module.exports = router;