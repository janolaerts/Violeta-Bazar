module.exports = {
  mongodb: {
    dbURI: process.env.MONGODB
  },
  stripe: {
    publishable: process.env.STRIPE_PUBLISHABLE_KEY,
    secret: process.env.STRIPE_SECRET_KEY
  },
  gmail: {
    pass: process.env.GMAIL_PASS
  }
};