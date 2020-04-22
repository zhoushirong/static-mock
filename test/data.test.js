const test = require('tape')

/**
 * 检查 mock 文件返回类型
 */
function checkMockFile() {
  try {
    require('../src/mockSwitchMap')
    return true
  } catch(err) {
    return err
  }
}

test('mock data test ->:', function(t) {
  t.plan(1)
  t.equal(checkMockFile(), true)
})
