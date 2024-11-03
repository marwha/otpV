const express = require('express')
const app = express()
const users = require('./model/user')
const bodyParser = require('body-parser')
const cors = require('cors')
const redis = require('redis')
const crypto = require('crypto')
const client = redis.createClient({ url: 'redis://localhost:6379' })
const port = process.env.PORT || 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/register', async (req, res) => {
  await client.connect()
  let cachedData = await client.get(`user:${req.body.number}`);
  console.log(cachedData)
  const user = new users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    verified: JSON.parse(cachedData).otp == req.body.otp
  });
  try {
    res.status(200).send(await user.save());
  } catch (error) {
    res.status(409).send(error);
  }
})

app.post('/verify', async (req, res) => {
  await client.connect()
  const cachedData = await client.get(`user:${req.body.number}`);
  let responseData = {};
  let otp = generateOTP(6);
  try {
    if (cachedData) {
      JSON.parse(cachedData).otp == req.body.otp ? (responseData.status = 200, responseData.data = 'verified') : (responseData.status = 300, responseData.data = 'Not Matched');
    } else{
      await client.set(`user:${req.body.number}`, JSON.stringify({ otp: otp, verified: false }), { EX: 120 });
      responseData.status = 200;
      responseData.data = 'Inserted';
    };
    await client.disconnect()
    res.status(responseData.status).send(responseData);
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post('/login', async (req, res) => {
  res.send('Hello World!')
})

app.get('/', async (req, res) => {
  users.find().then((users) => res.send(users))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function generateOTP(length) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}