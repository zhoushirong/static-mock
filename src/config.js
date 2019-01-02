let path = require('path')
/**
 * 配置文件
 */
const config = {
  apiPath: path.join(__dirname, '../api'), // api 文件主路径（绝对路径）
  port: '8587', // 端口
  suffix: '', // 接口后缀，如 ‘.html / .json’
  prefix: '/' // 接口前缀
}

module.exports = config