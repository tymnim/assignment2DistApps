
const {
  retrieveDataFrom,
  idFromString,
  stringFromId
} = require("../utils.js")

exports.getSong = {
  type: "post",
  path: "/addsong/",
  authNeeded: true,
  callback: async function addSong(req, res) {
    try {
      const { artist, title, released, album, music } = await retrieveDataFrom(req)
      const user = global.db.collection("users").findOne({ name: req.username })

      const newSong = {
        artist,
        title,
        released,
        album,
        link: "https:/link-to-mp3-converted-song.com/externalFileId",
        reviews: [],
        views: 0
      }

      const insertionResult = await global.db.collection("songs").insertOne(newSong)
      const { insertedId } = insertionResult

      res.status(200)
      res.send({ OK: "The song has been added successfully", songId: insertedId })
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