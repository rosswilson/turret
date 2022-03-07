const Joi = require("joi");

const nameSchema = Joi.string().trim().max(50).required();

const emailSchema = Joi.string()
  .trim()
  .email({ minDomainSegments: 2 })
  .required();

const passwordSchema = Joi.string().min(8).max(100).required();

const repeatPasswordSchema = Joi.any().valid(Joi.ref("password")).required();

const registerSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  repeatPassword: repeatPasswordSchema,
});

const signInSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

module.exports = { registerSchema, signInSchema };
