const router = require('express').Router();
const Product = require('../mongodb/products-model');
const Cart = require('../mongodb/cart-model');
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

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
        res.render('shop', { products: products, message: `${req.query.name.replace('-', ' ')} ya está en el carrito!`, toShop: false });
        return
      }
      else {
        new Cart({
          name: req.query.name,
          price: req.query.price,
          img: req.query.img,
          id: req.query._id,
          quantity: req.query.quantity,
          offset: req.query.price
        }).save().then(item => res.render('shop', { products: products, message: `Añadiste ${req.query.name.replace('-', ' ')} al carrito!`, toShop: false }));
      }
    });
  })
})

router.get('/cart', (req, res) => {
  let total = 0;
  Cart.find().then(items => {
    items.forEach(item => {
      total = total += item.price;
    })
    res.render('cart', { products: items, total: total });
  })
})

router.get('/add-quantity', (req, res) => {
  Cart.findOneAndUpdate({ name: req.query.name }, { quantity: req.query.quantity, price: req.query.price })
  .then(Cart.find().then(() => {
    res.redirect('/cart');
  }))
})

router.get('/remove-quantity', (req, res) => {
  if(req.query.quantity == 0) {
    Cart.findOneAndRemove({ name: req.query.name }).then(res.redirect('/cart'));
  }
  else {
  Cart.findOneAndUpdate({ name: req.query.name }, { quantity: req.query.quantity, price: req.query.price })
    .then(Cart.find().then(() => {
      res.redirect('/cart');
    }))
  }
})

router.post('/filter-products', urlencodedParser, (req, res) => {
  let products = [];
  const capitalize = ([...term]) => {
    term.forEach((letter, index) => {
      if(index == 0 || term[index - 1] == ' ') {
        let capital = letter.toUpperCase();
        term[index] = capital;
      }
    })
    Product.find().then(items => {
      items.forEach(item => {
        if(item.name.includes(term.join(''))) {
          products.push(item);
        }
      })
    }).then(() => res.render('shop', { products: products, message: null, toShop: true }));
  }
  capitalize([...req.body.term]);
})

module.exports = router;