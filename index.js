const express = require('express')
const app = express()
const connect = require('./connection')
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
    const user = await connect;
    user.collection('users').find().toArray().then((users) => res.send(users))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})