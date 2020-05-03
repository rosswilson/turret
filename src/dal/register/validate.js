const { registerSchema } = require("../schemas");

function validate(payload) {
  return registerSchema.validate(payload, { abortEarly: false });
}

module.exports = validate;
