import get from 'lodash.get';

const language = typeof window === 'undefined' ? 'en' : get(window, 'navigator.language', 'en').slice(0, 2);

export default language;