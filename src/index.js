const Koa = require('koa')
const favicon = require('koa-favicon');
const bodyParser = require('koa-body')
const router = require('./router')
const config = require('./config')
const app = new Koa()

app.use(favicon(__dirname + '/favicon.ico'));
app.use(
  bodyParser({ 
    multipart: true,
    formidable: { maxFileSize: 200 * 1024 * 1024 }
  })
)

module.exports = (_config) => {
  Object.assign(config, _config)
  router(app, config)

  app.on('error', (err, ctx) => {
    console.log('server error', err, ctx)
  })
  
  // 注意：这里的端口要和webpack里devServer的端口对应
  console.log('Project proxy is running at', `port:${config.port}`)
  app.listen(config.port)
}
