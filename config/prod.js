// PROD-ENV CONFIGURATIONS AND CREDENTIALS.
module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtTokenKey: process.env.JWT_TOKEN_KEY
};
