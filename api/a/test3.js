/**
 * 测试接口3
 */
let Mock = require('mockjs')
const configList = {
  size: {
    'big': true,
    'normal': false,
    'mini': false,
  },
  age: { // 对象，单选
    '< 18': true,
    '>= 81': false,
  },
  family: [{ father: true }, { mother: true }, { sister: false }], // 数组，多选
  desc: '你是最帅的', // 字符串，手动输入框
}

const getConfigData = (config, params)=> {
  return Mock.mock({
    status: 200,
    data: {
      size: config.size,
      age: config.age,
      family: config.family,
      desc: config.desc,
    },
    message: '@cword(7, 20)',
  })
}
// 返回的结果处理
module.exports = {
  configList,
  configData: (config, params) => getConfigData(config, params)
}