const joi = require('joi');

const signing = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^[0-9a-zA-Z_\s'’ʼ-]{8,20}$/)
    .required(),
});

exports.usersSchema = { signing };
