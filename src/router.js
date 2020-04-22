
const send = require('koa-send')
const Router = require('koa-router')
const router = new Router()
const tools = require('./tools')
const mockSwitchMapData = require('./mockSwitchMap')

const _config = {}
let $config = {} // 设置一个cache，让 /mock-switch 设置过的数据能够直接给页面

router.post('/mock-switch/list', async (ctx, next) => {
  ctx.body = mockSwitchMapData.map(item => {
    const cache = $config[item.url]
    if (cache) { // 如果缓存中有数据，则用缓存的数据
      item.configList = cache
    }
    return item
  })
  await next()
})

router.get('/mock-switch/index', async (ctx, next) => {
  await send(ctx, './index.html', {
    root: __dirname + '/'
  })
  await next()
})

router.post('/mock-switch/change', async (ctx, next) => {
  ctx.body = getResponseData(ctx, ctx.request.body.url, true)
  await next()
})

/**
 * @param {*} ctx 
 * @param {*} mockApiUrl 
 * @param {*} isSwitch 是否是开关调用， 默认 false
 */
function getResponseData(ctx, mockApiUrl, isSwitch) {
  const mockData = require(`${_config.apiPath}${mockApiUrl}.js`)
  let configList = mockData.configList
  const params = ctx.method.toLowerCase() === 'get' ? ctx.query : ctx.request.body

  if (isSwitch) { // 开关接口 合并请求开关的数据，并缓存
    const { key, value } = ctx.request.body
    configList = tools.combineNewConfig(key, value, configList)
    $config[mockApiUrl] = configList // 缓存配置
  } else if ($config.hasOwnProperty(mockApiUrl)) { // 非开关接口，有缓存则取缓存开关数据
    configList = $config[mockApiUrl]
  }
  if (configList) { // 设置缓存
    return mockData.configData(tools.getConfig(configList), params)
  }
  if (typeof mockData === 'function') {
    return mockData(params) // 不需要开关控制的接口
  }
  return mockData
}

function writeCookie(ctx, data) {
  const __cookie__ = data['__cookie__']
  if (!__cookie__) {
    return
  }
  ctx.cookies.set(__cookie__['key'], __cookie__['value'], {
    expires: __cookie__['expires'] || new Date(Date.now() + 10000), 
    httpOnly: __cookie__['httpOnly'] || false 
  })
}

function dealSpecialPath(ctx) {
  return ctx.path.replace(new RegExp(`${_config.suffix}`), '')
}

module.exports = ((app, config) => {
  Object.assign(_config, config)

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/mock-switch')) { // 此处仅处理 非开关 的路由
      return await next()
    }
    const url = dealSpecialPath(ctx)
    ctx.body = getResponseData(ctx, url)
    writeCookie(ctx, ctx.body)
    return await next()
  })

  return router
})

