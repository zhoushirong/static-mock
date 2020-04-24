/**
 * 测试接口2
 */
let Mock = require('mockjs')
const configList = {
  status: {
    'NORMAL': true,
    'PENDING': false,
    'INIT': false,
  },
  a: { // 对象，单选
    a1Value: true,
    a2Value: false,
  },
  arr: [{ arr1Value: true, arr2Value: true, arr3Value: false }], // 数组，多选
  str: 'abcefghij', // 字符串，手动输入框
}


const getConfigData = (config, params)=> {
  return Mock.mock({
    status: 200,
    data: {
      status: config.status,
      a: config.a,
      arr: config.arr,
      string: config.str,
    },
    message: '@cword(7, 20)',
  })
}
// 返回的结果处理
module.exports = {
  configList,
  configData: (config, params) => getConfigData(config, params)
}