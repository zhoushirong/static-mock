
const send = require('koa-send')
const Router = require('koa-router')
const router = new Router()
const tools = require('./tools')
const mockSwitchMapData = require('./mockSwitchMap')
const getAgentResponseData = require('./getAgentResponseData')

let agentUrl = ''
let agentHeaders = ''
const config = {}
let $config = {} // 设置一个cache，让 /mock-switch 设置过的数据能够直接给页面

router.post('/mock-switch/list', async (ctx, next) => {
  ctx.body = mockSwitchMapData(config).map(item => {
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

router.post('/mock-switch/agent', async (ctx, next) => {
  agentUrl = ctx.request.body.url
  agentHeaders = ctx.request.body.agentHeaders
  ctx.body = {
    status: 200,
    result: {
      agentUrl,
      agentHeaders
    }
  }
  await next()
})

/**
 * @param {*} ctx 
 * @param {*} mockApiUrl 
 * @param {*} isSwitch 是否是开关调用， 默认 false
 */
function getResponseData(ctx, mockApiUrl, isSwitch) {
  const mockData = require(`${config.apiPath}${mockApiUrl}.js`)
  let configList
  const params = ctx.method.toLowerCase() === 'get' ? ctx.query : ctx.request.body
  
  if ($config.hasOwnProperty(mockApiUrl)) { // 有缓存则取缓存
    configList = $config[mockApiUrl]
  } else {
    configList = mockData.configList
  }

  if (isSwitch) { // 开关接口 合并请求开关的数据，并缓存
    const { key, value } = ctx.request.body
    configList = tools.combineNewConfig(key, value, configList)
    $config[mockApiUrl] = configList // 缓存配置
  }

  if (configList) { // 返回有configList 和 configData 的数据
    return mockData.configData(tools.getConfig(configList), params)
  }
  if (typeof mockData === 'function') { // 返回 function 接口的数据
    return mockData(params)
  }
  return mockData // 返回 JSON 数据
}

/**
 * 路由前置处理
 * @param {*} ctx 
 */
function beforeRouter(ctx) {
  ctx = config.beforeRouter(ctx, agentUrl, agentHeaders)
  if (!agentUrl) {
    ctx.path = ctx.path.replace(new RegExp(`${config.suffix}`), '')
  }
}

function afterRouter(ctx) {
  if (!ctx.body) {
    return
  }
  const __cookie__ = ctx.body['__cookie__']
  if (!__cookie__) {
    return
  }
  ctx.cookies.set(__cookie__['key'], __cookie__['value'], {
    expires: __cookie__['expires'] || new Date(Date.now() + 10000), 
    httpOnly: __cookie__['httpOnly'] || false 
  })
}

module.exports = ((app, _config) => {
  Object.assign(config, _config)

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/mock-switch')) { // 此处仅处理 非开关 的路由
      return await next()
    }
    beforeRouter(ctx)
    if (!agentUrl) {
      ctx.body = getResponseData(ctx, ctx.path)
    } else {
      const params = ctx.method.toLowerCase() === 'get' ? ctx.query : ctx.request.body
      ctx.body = await getAgentResponseData(ctx.method, ctx.path, params, agentUrl, agentHeaders)
    }
    afterRouter(ctx)
    return await next()
  })

  return router
})

