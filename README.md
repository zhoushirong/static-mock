# 一个简单的 nodejs mock 服务

### 介绍
基于 express 的 mock 服务应用，适用于本地开发做数据 mock
支持无配置一键启动
支持 post get 请求方法

### 原理
创建一个 js mock 文件，文件里面通过 nodejs 的 module.exports 接口导出一个 json 对象
启动服务，服务读取 mock 文件，暴露 mock server 接口。


### 安装
``` shell
npm install static-mock --save-dev # 安装
```

### 使用默认配置，mock 文件放到 ./node_modules/static-mock/api 目录下
创建 nodejs 文件，直接 require 
```javascript
// index.js
require('static-mock')()
```
#### 启动
```shell
node index.js
```

#### 默认端口以及默认接口示例：
``` shell
http://localhost:8587/test1
```

### 使用自定义配置，指定端口、接口前后缀、mock 文件位置
```javascript
const path = require('path')
const mock = require('static-mock')
const config = {
  port: '8589', // 端口
  suffix: '', // 接口后缀，如 ‘.html / .json’ 定义后缀之后访问：http://localhost:8587/test1.html
  prefix: '/', // 接口前缀，定义后缀之后访问：http://localhost:8587/xxx/test1
  apiPath: path.join(__dirname, './mockApi') // 自定义 mock 文件位置 (需不为空的文件夹的绝对路径)
}
mock(config)
```
接口访问：
```
http://localhost:8589/test1
```

---

### apiPath mock 数据举例，mock 文件需遵循 commonjs 规范，返回一个 JSON 对象
*注意： ___cookie___ 为接口提供 cookie 信息，此字段为内置字段名，表示需要在接口中返回的需要写入的 cookie 信息（可选）*

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
const Mock = require('mockjs')
const mockData = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
  }]
})

const jsonData = {
  'message': 'SUCCESS',
  'result': { 
    'heng': '哼！',
    'random': mockData
  },
  'status': 200
}

module.exports = jsonData
```

### 更新
2019-01-15 v1.0.5 -- 更新了 window 兼容
2019-02-12 v1.0.6 -- 更新了 readme

