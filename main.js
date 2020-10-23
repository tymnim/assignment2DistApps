'use strict'

require('dotenv').config() // sets up env params

const express = require('express')
const fs = require("fs")

const utils = require('./src/utils.js')

const DB_URL = "mongodb://127.0.0.1:27017/utunes"
const ROUTES_FOLDER = "./src/routes/"

async function main() {
  // TODO: private key read base on process.env variable

  // sets up database connection
  const db = await utils.dbConnect(DB_URL)
  global.db = db
  
  // creates express app
  const app = express()
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
  
  // scans ROUTES_FOLDER and adds route for every one specificed
  const routes = fs.readdirSync(ROUTES_FOLDER).map(fileName => require(`${ROUTES_FOLDER}${fileName}`))
  utils.addRoutes(routes, app)
}

main().catch(console.error)
