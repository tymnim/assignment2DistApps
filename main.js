'use strict'

const utils = require('./src/utils.js')
const express = require('express')
const jwt = require("jsonwebtoken")
const fs = require("fs")


const DB_URL = "mongodb://127.0.0.1:27017/utunes"
const ROUTES_FOLDER = "./src/routes/"

async function main() {
  
  const db = await utils.dbConnect(DB_URL)
  global.db = db
  
  const app = express()
  app.use(
    express.urlencoded({
      extended: true
    })
  )
  app.use(express.json())
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
  
  const routes = fs.readdirSync(ROUTES_FOLDER).map(fileName => require(`${ROUTES_FOLDER}${fileName}`))
  utils.addRoutes(routes, app)
}

main().catch(console.error)







// app.post('/', (req, res) => {
//   console.log(req, req.cookies, req.params)
//   res.cookie("token", "qwerty", {maxAge: 10800})
//   res.send("hi")
// })

// app.post('/signup', async (req, res) => {
//   try {
//     const { username, password } = await retrieveDataFrom(req);
//     const encrypredPassword = await makeHashOf(password);
//   }


//   res.cookie("token", "qwerty", {maxAge: 10800})
//   res.send("hi")
// })



// function userExists(username) {

// }



// app.post('/api/creteNewUser', (req, res) => {
//   // ...
//   const token = generateAccessToken({ username: req.body.username })
//   res.json(token)
//   // ...
// });

