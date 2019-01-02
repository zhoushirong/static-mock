/**
 * 测试接口1
 */
let Mock = require('mockjs')
var mockData = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
  }]
})

let jsonData = {
  '__cookie__': {
    key: 'cookcie2',
    value: 'hahavalue2'
  },
  'message': 'SUCCESS',
  'result': { 
    'heng': '哼！',
    'random': 'mockData'
  },
  'status': 200
}

module.exports = jsonData