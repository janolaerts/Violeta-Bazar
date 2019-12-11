module.exports = {
  mongodb: {
    dbURI: `mongodb+srv://${process.env.MongoDBUser}:${process.env.MongoDBPassword}@products-cd5i4.mongodb.net/test?retryWrites=true&w=majority`
  },
  stripe: {
    publishable: process.env.STRIPE_PUBLISHABLE_KEY,
    secret: process.env.STRIPE_SECRET_KEY
  },
  gmail: {
    pass: process.env.GMAIL_PASS
  }
};