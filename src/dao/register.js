const Joi = require("@hapi/joi");

const schema = Joi.object({
  name: Joi.string().trim().max(50).required(),

  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),

  password: Joi.string().min(8).max(100).required(),

  repeatPassword: Joi.ref("password"),
});

function validate(payload) {
  return schema.validate(payload, { abortEarly: false });
}

module.exports = { validate };
