
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

      const songId = req.params?.songId;
      const song = global.db.findOne({ _id: songId });
      if (!song) {
        res.status(404)
        res.send("Song is not found")
        res.end()
        return
      }

      await global.db.update({ _id: songId }, { $inc: "views" })

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