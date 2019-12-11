module.exports = {
  mongodb: {
    dbURI: 'mongodb+srv://User:PjHWMhZ3DxvNhH3m@products-cd5i4.mongodb.net/test?retryWrites=true&w=majority'
  },
  stripe: {
    publishable: process.env.STRIPE_PUBLISHABLE_KEY,
    secret: process.env.STRIPE_SECRET_KEY
  },
  gmail: {
    pass: process.env.GMAIL_PASS
  }
};