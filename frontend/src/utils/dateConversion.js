import { utcToZonedTime, format, zonedTimeToUtc } from 'date-fns-tz';
import differenceInCalendarYears from 'date-fns/differenceInCalendarYears';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import roLocale from 'date-fns/locale/ro';
import enUsLocale from 'date-fns/locale/en-US';

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
};

const dateTimeFormats = {
  en: 'yyyy-MM-dd HH:mm:ss',
  ro: 'dd-MM-yyyy HH:mm:ss',
};

export const getDateTimeFormat = () => dateTimeFormats[language];

export const age = (birthday) =>
  differenceInCalendarYears(new Date(), new Date(birthday));

export const timeAgo = (someDate) =>
  formatDistanceToNow(new Date(fromUtc(someDate)), { locale: language === 'en' ? enUsLocale : roLocale  });
