const test = require('tape')
const path = require('path')
const getMockFileObj = require('../src/get-mock-file-obj')


/**
 * 检查 mock 文件返回类型
 */
function checkMockFile() {
  let config = {
    apiPath: path.join(__dirname, '../api'), // api 文件主路径（绝对路径）
    port: '8587', // 端口
    suffix: '', // 接口后缀，如 ‘.html / .json’
    prefix: '/' // 接口前缀
  }
  let mockFile = getMockFileObj(config)
  let arr = []
  for (let i in mockFile) {
    let tp = typeof mockFile[i]
    if (tp !== 'object') {
      arr.push(`${i} return data is ${tp} ,should be object or function!`)
    }
  }
  if (arr.length > 0) {
    return arr
  }
  return true
}

test('mock data test ->:', function(t) {
  t.plan(1)
  t.equal(checkMockFile(), true)
})
