const express = require('express')
const app = express()
const users = require('./model/user')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/register', async (req, res) => {
  const user = new users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    verified: false
  });
  try {
    res.status(200).send(await user.save());
  } catch (error) {
    res.status(409).send(error);
  }
})

app.get('/verify', async (req, res) => {
  res.send('Hello World!')
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