
const fs = require('fs')
const join = require('path').join
const config = {}
let fileList = []

/**
 * 遍历文件夹下面的所有文件，获取文件路径
 * @param {*} path 
 */
function findJsonFile(path){
  fs.readdirSync(path).forEach(file  => {
    const fpath = join(path, file)
    const stat = fs.statSync(fpath)
    if(stat.isDirectory()) {
      findJsonFile(fpath)
    } else if (stat.isFile()) { 
      fileList.push(fpath)
    }
  })
}

module.exports = function (_config) {
  Object.assign(config, _config)
  fileList = []
  findJsonFile(config.apiPath)
  return fileList.map(item => {
    let configList
    try {
      configList = require(item).configList
    } catch(e) {
      // console.log(e)
    }
    return {
      url: item.replace(config.apiPath, '').replace(/\\/g, '/').replace('.js', ''),
      configList
    }
  }).filter(item => item.configList)
}
