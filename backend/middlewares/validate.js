const { validationResult } = require("express-validator");

/**
 * Run after express-validator rule arrays.
 * Returns 422 with the first error per field if validation fails.
 */
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
