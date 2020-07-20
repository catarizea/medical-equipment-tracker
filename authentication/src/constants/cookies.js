module.exports = {
  REFRESH_TOKEN_COOKIE: 'refreshToken',
  REFRESH_TOKEN_COOKIE_OPTIONS: {
    maxAge: process.env.AUTHENTICATION_REFRESH_TOKEN_EXPIRES * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.NODE_ENV === 'production' ? 'medical.equipment' : '127.0.0.1',
    sameSite: true,
  },
};
