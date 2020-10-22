
const {
  retrieveDataFrom,
  passwordsMatch,
  userExists,
  SALT_ROUNDS,
  generateAccessTokenFor
} = require("../utils.js")

exports.logIn = {
  type: "post",
  path: "/login",
  authNeeded: false,
  callback: async function logIn(req, res) {
    try {
      const { username, password } = await retrieveDataFrom(req)

      const user = await db.collection("users").findOne({ name: username })
      if (!user) {
        res.status(404)
        res.send({ error: `User ${username} is not found` })
        res.end()
        return
      }

      const passwordMatch = await passwordsMatch(password, user.password.hash)
      if (!passwordMatch) {
        res.status(403)
        res.send({ error: `Password mismatch` })
        res.end()
        return
      }

      const token = generateAccessTokenFor(username)

      if (token) {
        res.status(200)
        res.send({ OK: "Authorized Successfully", jwt: token })
        res.end()
      }
    }
    catch (err) {
      console.error(err)
      res.status(500)
      res.send({ error: "Internal server error" })
      res.end()
    }
  }
}