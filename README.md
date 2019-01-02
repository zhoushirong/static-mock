# 一个简单的 nodejs mock 服务

### 介绍
基于 express 的 mock 服务框架，一键启动，支持 post get 方法


#### 启动方式
``` shell
npm install static-mock --save-dev # 安装
```

### 默认配置，mock 文件放到 ./node_modules/static-mock/api 目录下
```javascript
require('static-mock')()
```

### 访问 Mock 服务
``` shell
http://localhost:8587/test1
```

### 自定义配置
```javascript
const path = require('path')
const mock = require('static-mock')
const config = {
  port: '8587', // 端口
  suffix: '', // 接口后缀，如 ‘.html / .json’ 定义后缀之后访问：http://localhost:8587/test1.html
  prefix: '/', // 接口前缀，定义后缀之后访问：http://localhost:8587/xxx/test1
  apiPath: path.join(__dirname, './mockApi') // 自定义 mock 文件位置 (需不为空的文件夹的绝对路径)
}
mock(config)
```

### apiPath mock 数据举例，mock 文件需遵循 commonjs 规范，返回一个 JSON 对象
*注意： ___cookie___ 为接口提供 cookie 信息*

1. 使用 commonjs 规范，返回 json 数据（/mockApi/test1.js）
```javascript
// 返回的结果处理
module.exports = function() {
  return {
    '___cookie___': {
      key: 'cookieKey',
      value: 'cookieValue',
      expires: 'cookieExpires',
      httpOnly: false
    },
    'message': 'SUCCESS',
    'result': {
      'data': true
    },
    'status': 200
  }
}
```

2. 支持 mockjs 生成数据，返回 json 数据
```javascript
let Mock = require('mockjs')
var mockData = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
  }]
})

let jsonData = {
  'message': 'SUCCESS',
  'result': { 
    'heng': '哼！',
    'random': mockData
  },
  'status': 200
}

module.exports = jsonData
```