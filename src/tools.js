/**
 * 将配置页面的数据转换为能用的数据
 * @param {*} configList 
 */
function getConfig(configList) {
  const newConfigList = {}
  for (let item in configList) {
    const configListItem = configList[item]

    if (configListItem instanceof Array) {
      newConfigList[item] = configListItem.map(arrItem => {
        for (let i in arrItem) {
          if (arrItem[i]) {
            return i
          }
        }
      }).filter(item => item)
    } else if (typeof configListItem === 'string') {
      newConfigList[item] = configListItem
    } else {
      newConfigList[item] = Object.keys(configListItem).find(objItem => configListItem[objItem])
    }
  }
  return newConfigList
}

/**
 * 合并页面配置过来的数据
 * @param {*} key 
 * @param {*} value 
 * @param {*} configList 
 */
function combineNewConfig(key, value, configList) {
  const config = JSON.parse(JSON.stringify(configList))
  if (!key) {
    return config
  }
  if (value instanceof Array) {
    config[key] = config[key].map(item => {
      for (let i in item) {
        if (value.includes(i)) {
          item[i] = true
        } else {
          item[i] = false
        }
      }
      return item
    })
  } else if (typeof value === 'string') {
    config[key] = value
  } else {
    for (let i in config[key]) {
      if (i === value) {
        config[key][i] = true
      } else {
        config[key][i] = false
      }
    }
  }

  return config
}

module.exports = {
  getConfig,
  combineNewConfig
}