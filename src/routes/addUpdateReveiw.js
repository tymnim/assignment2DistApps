
const {
  retrieveDataFrom,
  idFromString,
  stringFromId
} = require("../utils.js")

exports.addUpdateReview = {
  type: "post",
  path: "/review/:songId",
  authNeeded: true,
  callback: async function addUpdateReview(req, res) {
    try {
      if (! req.params?.songId) {
        res.status(400)
        res.send("Song ID is requiered")
        res.end()
        return
      }

      const songId = req.params?.songId;
      const song = global.db.collection("songs").findOne({ _id: idFromString(songId) });

      if (!song) {
        res.status(404)
        res.send("Song is not found")
        res.end()
        return
      }

      const user = await global.db.collection("users").findOne({ name: req.username })
      if (!user) {
        res.status(403)
        res.send("Authentification Needed")
        res.end()
        return
      }

      const { like, review = "" } = await retrieveDataFrom(req)
      const reviewExists = await global.db.collection("reviews").findOne({ songId, username: user.name })
      if (reviewExists) {
        await global.db.collection("reviews").updateOne({ _id: reviewExists._id }, { $set: { like, review, updatedAt: new Date() } })
        res.status(200)
        res.send({ OK: "Review was updated successfully" })
        res.end()
        return
      }

      const newReview = {
        like,
        review,
        songId,
        username: user.name,
        updatedAt: new Date()
      }

      await global.db.collection("reviews").insertOne(newReview)

      res.status(200)
      res.send({ OK: "Review was created successfully" })
      res.end()
    }
    catch (err) {
      console.error(err)
      res.status(500)
      res.send({ error: "Internal server error" })
      res.end()
    }
  }
}