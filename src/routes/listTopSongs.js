
exports.listTopSongs = {
  type: "get",
  path: "/top",
  authNeeded: true,
  callback: async function getTopSongs(req, res) {
    try {
      const topSongs = await new Promise((resolve, reject) => { 
        global.db.collection("songs").find({}, { sort: { reviews: -1 }, limit: 100 }).toArray((err, songs) => {
          if (err) {
            reject(err)
            return
          }
          resolve(songs)
        })
      })

      if (!topSongs.length) {
        res.status(404)
        res.send("There's no popular songs yet")
        res.end()
        return
      }
      res.status(200)
      res.send({ songs: topSongs })
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