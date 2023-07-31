// DECIDE WHICH SET OF CONFIGURATIONS AND CREDENTIALS TO USE BASED ON DEV OR PROD ENVIRONMENT.
if (process.env.NODE_ENV === "production") {
  // WE ARE IN PRODUCTION --> RETURN THE PROD SET OF KEYS.
  module.exports = require("./prod");
} else {
  // WE ARE IN DEVELOPMENT --> RETURN THE DEV SET OF KEYS.
  module.exports = require("./dev");
}
