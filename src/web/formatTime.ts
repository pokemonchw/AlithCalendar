const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const MAX_RELATIVE_TIME = 7 * DAY;

export function formatTime(time: Date) {
  const relativeTime = Date.now() - time.getTime();
  if (relativeTime > MAX_RELATIVE_TIME) {
    return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
  }
  if (relativeTime > DAY) {
    return `${Math.floor(relativeTime / DAY)} 天前`;
  }
  if (relativeTime > HOUR) {
    return `${Math.floor(relativeTime / HOUR)} 小时前`;
  }
  if (relativeTime > MINUTE) {
    return `${Math.floor(relativeTime / MINUTE)} 分钟前`;
  }
  return `${Math.floor(relativeTime / SECOND)} 秒前`;
}
