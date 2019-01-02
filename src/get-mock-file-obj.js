const fs = require('fs')
const path = require('path')

function getFPath(filedir, config) {
  let reg1 = new RegExp(config.apiPath)
  let prefix = ''
  if (config.prefix && config.prefix !== '/') {
    prefix = path.resolve('/', config.prefix)
  }
  
  // 处理前、后缀、windows 路径
  let fpath = filedir
  .replace(reg1, prefix)
  .replace(/\..*/, config.suffix)
  .replace(/\\\\/g, '/')

  return fpath
}

let pathObj = {}
function dealFileApi(filePath, config) {
  filePath = filePath || config.apiPath
  let files = []
  try {
    files = fs.readdirSync(filePath)
  } catch(e) {
    console.log(e)
  }
  files.forEach(function (filename) {
    // 遍历读取到的文件列表，获取当前文件的绝对路径
    let filedir = path.join(filePath, filename)
    // 根据文件路径获取文件信息，返回一个 fs.Stats 对象
    let stats = fs.statSync(filedir)
    let isFile = stats.isFile() // 是文件
    let isDir = stats.isDirectory() // 是文件夹
    if (isFile) {
      let fileDirObj = require(filedir)
      if (typeof fileDirObj === 'function') {
        fileDirObj = fileDirObj()
      }
      let fpath = getFPath(filedir, config)
      pathObj[fpath] = fileDirObj
    }
    if (isDir) {
      dealFileApi(filedir, config) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  })
}

/**
 * 获取 mock 文件对象
 * @param {*} config 
 */
function getMockFileObj(config) {
  dealFileApi(null, config)
  return pathObj
}

module.exports = getMockFileObj
