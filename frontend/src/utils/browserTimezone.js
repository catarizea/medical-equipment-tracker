export default typeof Intl === 'object' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Europe/London';
