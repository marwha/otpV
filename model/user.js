const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();
const conn = mongoose.createConnection(process.env.MONGO_URL);

const users = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  verified: { type: Boolean, required: true }
}, { timestamps: true });
module.exports = conn.model('users', users);