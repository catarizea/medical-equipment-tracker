import get from 'lodash.get';

const language = typeof window === 'undefined' ? 'en' : get(window, 'navigator.language', 'en').slice(0, 2);

export const locale = get(window, 'navigator.language', 'en-US');

export default language;