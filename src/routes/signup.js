
const {
  retrieveDataFrom,
  makeHashOf,
  userExists,
  SALT_ROUNDS
} = require("../utils.js")

exports.signUp = {
  type: "post",
  path: "/signUp",
  authNeeded: false,
  callback: async function signUp(req, res) {
    try {
      const data = await retrieveDataFrom(req)
      console.log(data, req.body)
      const encrypredPassword = await makeHashOf(password, SALT_ROUNDS)
      const exists = await userExists(username, global.db)

      if (exists) {
        res.status(200)
        res.send({ message: "User was created successfully!" })
        res.end();
        return
      }
      const inserted = await global.db.collection("users").insertOne({
        name: userName,
        password: {
          saltRounds: SALT_ROUNDS,
          hash: encrypredPassword
        }
      })
      if (inserted) {
        res.status(200)
        res.send({ message: "User was created successfully!" })
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