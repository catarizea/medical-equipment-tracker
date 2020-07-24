module.exports = {
  presets: ['react-app'],
  plugins: [
    [
      'react-intl',
      {
        messagesDir: './src/i18n/translation/',
        extractSourceLocation: true,
      },
    ],
  ],
};
