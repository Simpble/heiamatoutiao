export const setItem = (key, value) => {
    // 将数组、对象类型的数据转换为 JSON 格式字符串进行存储
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
  }
  
  // 获取数据
  export const getItem = key => {
    const data = window.localStorage.getItem(key)
    try {
      // data数据是从localStorage里面取出来的，取出来的是一个字符串
      // 但是这个字符串可能是一个json格式的字符串，也可能是一个普通字符串
      return JSON.parse(data)
    } catch (err) {
      return data
    }
  }
  
  // 删除数据
  export const removeItem = key => {
    window.localStorage.removeItem(key)
  }