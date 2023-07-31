const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const { roleList } = require('./roles');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  // authHeader = 'Bearer token';
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, keys.jwtTokenKey);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  // CODE FOR ROLE-BASED-ACCESS-CONTROL
  if (roleList[decodedToken.role].find((url) => url === req.baseUrl)) {
    req.userId = decodedToken.userId;
  } else {
    const error = new Error('Not Authorized to access this route!');
    error.statusCode = 403;
    throw error;
  }

  next();
};
