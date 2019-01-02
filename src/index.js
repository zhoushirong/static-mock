const express = require('express')
// const https = require('https')
const http = require('http')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cookiePareser = require('cookie-parser')
const getMockFileObj = require('./get-mock-file-obj')

let defConfig = require('./config')

function init(config) {
  config = Object.assign({}, defConfig, config)
  const app = express()

  app.use(cookiePareser())
  // 文件上传
  app.use(fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024
    },
  }))
  app.use(bodyParser.urlencoded({ extended: true }))

  const apis = getMockFileObj(config)
  for (let i in apis) {
    app.get(i, function (req, res) {
      writeCookie(res, apis[i])
      res.send(apis[i]);
    });
    
    // POST method route
    app.post(i, function (req, res) {
      writeCookie(res, apis[i])
      res.send(apis[i]);
    });
  }

  function writeCookie(res, api) {
    let __cookie__ = api['__cookie__']
    if (__cookie__) {
      res.cookie(__cookie__['key'], __cookie__['value'],
      { 
        expires: __cookie__['expires'] || new Date(Date.now() + 10000), 
        httpOnly: __cookie__['httpOnly'] || false 
      })
    }
  }

  console.log(`----->: now mock api is listening port: ${ config.port }`)
  http.createServer(app).listen(config.port)
  // https.createServer({}, app).listen(443)
}

module.exports = init
