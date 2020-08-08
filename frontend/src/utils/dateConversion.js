import { utcToZonedTime, format, zonedTimeToUtc } from 'date-fns-tz';

import browserTimezone from './browserTimezone';
import language from './getBrowserLanguage';

export const fromUtc = (dateString) => {
  return utcToZonedTime(dateString, browserTimezone);
};

export const toUtc = (dateTimeString) => {
  return zonedTimeToUtc(dateTimeString, browserTimezone);
};

export const formatDate = (zonedDate, pattern) => {
  return format(zonedDate, pattern, { timeZone: browserTimezone });
}

const dateTimeFormats = {
  'en': 'yyyy-MM-dd HH:mm:ss',
  'ro': 'dd-MM-yyyy HH:mm:ss'
};

export const getDateTimeFormat = () => dateTimeFormats[language];