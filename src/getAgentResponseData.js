const request = require('request')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

module.exports = async function(ctx, agentUrl, agentHeaders) {
  let url = ctx.path
  let method = ctx.method.toLowerCase()
  const query = ctx.query
  const body = ctx.request.body

  const params = Object.assign({}, query, body)

  if (agentHeaders && typeof agentHeaders === 'string') {
    throw('The proxy parameter must be json!')
  }
  if (!/:\/\//.test(url)) {
    url = agentUrl + url + '?'
  }
  for (let key in params) {
    url += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
  }

  const files = ctx.request.files
  const headers = Object.assign({
    'content-type': 'application/json',
  }, ctx.headers, agentHeaders)
  headers.host = agentUrl.split('://')[1]
  headers.origin = agentUrl

  const reqParams = Object.assign({
    timeout: 5000,
    method: method,
    uri: url,
    gzip: true,
    body: JSON.stringify(params),
    headers,
  })
  if (files) {
    const { path: filePath, name: originalFilename } = files.file
    const newPath = path.join(path.dirname(filePath), originalFilename)
    fs.renameSync(filePath, newPath)
    const file = fs.createReadStream(newPath)
    const formData = new FormData()
    formData.append('file', file)
    reqParams.body = formData
  }
  // 发起请求
  return await request(reqParams, (err) => {
    if (err) {
      throw err
    }
  })
}
