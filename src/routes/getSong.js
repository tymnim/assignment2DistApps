
const {
  idFromString
} = require("../utils.js")

exports.getSong = {
  type: "get",
  path: "/songs/:songId",
  authNeeded: true,
  callback: async function getSong(req, res) {
    try {
      if (! req.params?.songId) {
        res.status(400)
        res.send("Song ID is requiered")
        res.end()
        return
      }

      const songId = req.params?.songId
      const song = await global.db.collection("songs").findOne({ _id: idFromString(songId) })
      if (!song) {
        res.status(404)
        res.send("Song is not found")
        res.end()
        return
      }

      await global.db.collection("songs").updateOne({ _id: idFromString(songId) }, { $inc: { views: 1 } })
      song.views++
      res.status(200)
      res.send({ song })
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