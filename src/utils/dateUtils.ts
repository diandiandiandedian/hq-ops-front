// utils/dateUtils.ts

import dayjs from 'dayjs';

/**
 * 格式化时间戳为指定格式
 * @param timestamp - 时间戳 (毫秒)
 * @param format - 格式化字符串，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (
  timestamp: number,
  format: string = 'YYYY-MM-DD HH:mm'
): string => {
  return dayjs(timestamp).format(format);
};
