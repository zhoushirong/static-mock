const request = require('request')

module.exports = async function(method, url, params, agentUrl, agentHeaders) {
  if (agentHeaders && typeof agentHeaders === 'string') {
    throw('The proxy parameter must be json!')
  }
  if (!/:\/\//.test(url)) {
    url = agentUrl + url
  }
  if (method.toLowerCase() === 'get') {
    url += '?';
    for (let key in params) {
      url += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
    }
  }
  const reqParams = Object.assign({
    timeout: 5000,
    method: method,
    uri: url,
    gzip: true,
    body: JSON.stringify(params),
    headers: Object.assign({
      'content-type': 'application/json',
    }, agentHeaders)
  })
  // 发起请求
  return await request(reqParams, (err, response, body) => {
    if (err) {
      throw err
    }
    return response
  })
}