const bcrypt = require('bcrypt')
const { MongoClient } = require('mongodb')
const jwt = require("jsonwebtoken")

const SALT_ROUNDS = 10

function makeHashOf(password, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err)
        return
      }
      resolve(hash)
    })
  })
}

function passwordsMatch(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

function retrieveDataFrom(req) {
  return new Promise((resolve, reject) => {
    let data = ""
    req.on("data", chunk => {
      data += chunk
    })
    req.on("end", () => {
      let parsed;
      try {
        parsed = JSON.parse(data)
      }
      catch (err) {
        reject(new Error("Failed to parse json"))
      }
      resolve(parsed)
    })
    req.on("error", (err) => {
      reject(err)
    })
  })
}

// function authenticateToken(req, res, next) {
//   // Gather the jwt access token from the request header
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.sendStatus(401) // if there isn't any token

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err)
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next() // pass the execution off to whatever request the client intended
//   })
// }

function generateAccessTokenFor(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
}

function exitHandler(cleanUpFn) {
  process.stdin.resume() // so the program will not close instantly
  const exit = () => {
    cleanUpFn()
    process.exit()
  }
  process.on('exit', exit)
  //catches ctrl+c event
  process.on('SIGINT', exit)
  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exit)
  process.on('SIGUSR2', exit)
  //catches uncaught exceptions
  process.on('uncaughtException', exit)
}

function dbConnect(url) {
  return new Promise((resolve, reject) => {
    const cl = new MongoClient(url)
    cl.connect((err, client) => {
      if (err) {
        reject(err)
        return
      }
      exitHandler(() => {
        console.log(" - Closing Database Conneciton")
        client.close()
      })
      const db = client.db("utunes")
      console.log(" - Connected to Database")
      resolve(db)
    })
  })
}

function addRoutes(routes, app) {
  routes.forEach(route => {
    const name = Object.keys(route)[0]
    console.log(` + Adding ${name} route`)
    const { type, path, authNeeded, callback } = route[name]
    if (type === "get") {
      if (authNeeded) {
        app.get(path, authenticateToken, callback)
      }
      else {
        app.get(path, callback)
      }
      return
    }

    if (type === "post") {
      if (authNeeded) {
        app.post(path, authenticateToken, callback)
      }
      else {
        app.post(path, callback)
      }
      return
    }
  })
}

exports.SALT_ROUNDS = SALT_ROUNDS
exports.makeHashOf = makeHashOf
exports.retrieveDataFrom = retrieveDataFrom
// exports.authenticateToken = authenticateToken
exports.generateAccessTokenFor = generateAccessTokenFor
exports.exitHandler = exitHandler
exports.dbConnect = dbConnect
exports.addRoutes = addRoutes
exports.passwordsMatch = passwordsMatch
