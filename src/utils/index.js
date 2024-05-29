export function localGet (key) {
  const value = window.localStorage.getItem(key)
  if (value) {
    return value
  } else {
    return ''
  }
}

export function localSet (key, value) {
  window.localStorage.setItem(key, value)
}

export function localRemove (key) {
  window.localStorage.removeItem(key)
}
export function timestampToDate (timestamp) {
  // 创建一个新的 Date 对象，将时间戳作为参数传入
  const date = new Date(timestamp);
  // 使用 Date 对象的方法获取年、月、日等信息
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从 0 开始，需要加 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 构造日期字符串，例如：yyyy-MM-dd HH:mm:ss
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // 返回格式化后的日期字符串
  return formattedDate;
};