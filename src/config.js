const join = require('path').join

/**
 * 配置文件
 */
module.exports = {
  apiPath: join(__dirname, '../api'), // api 文件主路径（绝对路径）
  port: '8587', // 端口
  suffix: '', // 接口后缀，如 ‘.html / .json’
  beforeRouter: ctx => ctx, // 路由前置过滤
}