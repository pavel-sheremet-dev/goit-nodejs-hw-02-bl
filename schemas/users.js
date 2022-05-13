const joi = require('joi');
const fs = require('fs');
const { config } = require('../config');
const { checkObjectId } = require('../helpers');

const signing = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^[0-9a-zA-Z_\s'’ʼ-]{8,20}$/)
    .required(),
});

const updateSubscription = joi.object({
  id: joi.string().custom(checkObjectId).required(),
  subscription: joi
    .string()
    .valid(...config.getSubscriptions().all)
    .required(),
  superAdminPassword: joi.string().pattern(/^[0-9a-zA-Z_\s'’ʼ-]{8,30}$/),
});

exports.usersSchema = { signing, updateSubscription };
