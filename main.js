'use strict'

require('dotenv').config()

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
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
  
  const routes = fs.readdirSync(ROUTES_FOLDER).map(fileName => require(`${ROUTES_FOLDER}${fileName}`))
  utils.addRoutes(routes, app)
}

main().catch(console.error)
