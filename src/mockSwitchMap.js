
const fs = require('fs')
const join = require('path').join
const config = require('./config')
const apiPath = config.apiPath
const fileList = []

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
findJsonFile(apiPath)


module.exports = fileList.map(item => {
  let configList
  try {
    configList = require(item).configList
  } catch(e) {
    // console.log(e)
  }
  return {
    url: item.replace(apiPath, '').replace('.js', ''),
    configList
  }
}).filter(item => item.configList)










