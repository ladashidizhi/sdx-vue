import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc' // 导入 utc 插件
import timezone from 'dayjs/plugin/timezone' // 导入 timezone 插件
import duration from 'dayjs/plugin/duration'
dayjs.extend(utc) // 启用 utc 插件
dayjs.extend(timezone) // 启用 timezone 插件
dayjs.extend(duration)

export function formatYMDHNS(time, name) {
  let names = 'YYYY-MM-DD HH:mm:ss'
  if (name != null) {
    names = name
  }

  // 使用 dayjs 将日期转换为所需的格式
  return dayjs(time).utcOffset(8).format(names)
}

///D天H小时
export function formatDH(time) {
  const durationObject = dayjs.duration(time, 'seconds')
  const days = durationObject.days()
  const hours = durationObject.hours()
  return `${days} 天 ${hours} 小时`
}

export function formatYMD(time, name) {
  let names = 'YYYY-MM-DD'
  if (name != null) {
    names = name
  }

  // 使用 dayjs 将日期转换为所需的格式
  return dayjs(time).utcOffset(8).format(names)
}
