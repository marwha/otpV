const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

module.exports = MongoClient.connect(process.env.MONGO_URL)
    .then((con) => con.db(process.env.db))
    .catch((error) => console.error('MongoDB connection error:', error));