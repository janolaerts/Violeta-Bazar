const router = require('express').Router();
const Product = require('../mongodb/products-model');
const Cart = require('../mongodb/cart-model');
const bodyParser = require('body-parser');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripe.secret);
const nodemailer = require('nodemailer');
const helpers = require('../helpers');
const Order = require('../mongodb/order-model');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/about', (req, res) => {
  res.render('about');
})

router.get('/contact', (req, res) => {
  res.render('contact', { feedback: null });
})

router.get('/products', (req, res) => {
  Product.findOne({ name: req.query.name.replace('-', ' ') }).then(item => {
    res.render('product-details', { product: req.query, description: item.description });
  });
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
    res.render('cart', { products: items, total: total, stripePublishable: keys.stripe.publishable });
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

router.post('/charge', urlencodedParser, (req, res) => {
  let amount = req.query.amount;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount: amount * 100,
    description: 'Productos de Violeta Bazar',
    currency: 'pen',
    customer: customer.id
  }))
  .then(charge => {
    Cart.find().then(products => {
      let total = 0;
      products.forEach(product => {
        total = total += product.price;
      })
      Cart.remove().then(() => {
        res.render('success-payment', { products: products, total: total });
        new Order({
          client: req.body.stripeEmail,
          products: products,
          amount: `s./${total}`,
          date: new Date()
        }).save().then(item => {
          helpers.mailToClient(products, req.body.stripeEmail, total, item._id, item.date);
          helpers.mailToCompany(products, req.body.stripeEmail, total, item._id, item.date);
        });
      });
    })
  })
  .catch(error => {
      res.render('error-payment');
    })
})

router.post('/contact', urlencodedParser, (req, res) => {

  const contactToCompany = (info) => {

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'mail.google.com',
      auth: {
        user: 'violetbazarperu@gmail.com',
        pass: keys.gmail.pass
      },
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });

    let html = 
    `<h3 style="color: midnightblue;">Hay un nuevo mensaje de <strong style="text-decoration: underline;">${info.name}</strong> con correo <strong>${info.email}</strong> y número de teléfono <strong style="text-decoration: underline;">${info.phone}</strong></h3>
    <p style="color: midnightblue;">El mensaje fue enviado el: ${new Date()}</p>
    <p style="color: midnightblue;">Mensaje: </p>
    <p style="color: midnightblue;"><strong>${info.message}</strong></p>`;

    let mailOptions = {
      from: `${info.email}`,
      to: 'violetbazarperu@gmail.com',
      subject: `Hay un nuevo mensaje de ${info.name}`,
      html: html
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if(err) {
        console.log(err);
        res.render('contact', { feedback: 'Hubo un error al enviar el mensaje' })
      }
      else {
        console.log(`Email sent: ${info.response}`);
        res.render('contact', { feedback: 'Su mensaje fue enviado con éxito!' })
      }
    })

  }
  
  contactToCompany(req.body)
  helpers.contactToClient(req.body)
})

module.exports = router;