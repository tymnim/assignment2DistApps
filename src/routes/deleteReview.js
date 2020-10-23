
const {
  retrieveDataFrom,
  idFromString,
  stringFromId
} = require("../utils.js")

exports.deleteReview = {
  type: "delete",
  path: "/deletereview/:songId",
  authNeeded: true,
  callback: async function deleteReview(req, res) {
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

      const review = await global.db.collection("reviews").findOne({ songId, username: user.name })
      if (!review) {
        res.status(404)
        res.send("Review is not found")
        res.end()
        return
      }

      await global.db.collection("reviews").deleteOne({ _id: review._id })

      res.status(200)
      res.send({ OK: "Review was deleted successfully" })
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