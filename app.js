const express = require('express');
const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', routes);

app.get('/', (req, res) => {
  res.render('shop', { products: products });
})

app.listen(3000, () => {
  console.log('app is listening to port 3000');
})

const products = [
  { name: 'Lisador', price: 5, img: 'products/hair straightener.png' },
  { name: 'Colágeno', price: 10, img: 'products/collagen.png' },
  { name: 'Lipo cream', price: 15, img: 'products/lipo cream.png' },
  { name: 'Afeitador', price: 20, img: 'products/razor.png' }
];