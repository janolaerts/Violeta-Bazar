const router = require('express').Router();

router.get('/about', (req, res) => {
  res.render('about');
})

router.get('/contact', (req, res) => {
  res.render('contact');
})

router.get('/products', (req, res) => {
  res.send(req.query);
})

module.exports = router;