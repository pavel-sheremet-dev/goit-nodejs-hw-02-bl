const joi = require('joi');
const { checkObjectId } = require('../helpers');

const checkLimit = (value, helpers) => {
  const max = 20;
  if (value > max) {
    return helpers.message(`Max limit is ${max}`);
  }
  return value;
};

const contact = joi.object({
  name: joi
    .string()
    .pattern(/^[a-zA-Z\s'’ʼ-]{3,30}$/)
    .required(),
  email: joi.string().email().required(),
  phone: joi
    .string()
    .pattern(/^[0-9()+\s-]{10,19}$/)
    .required(),
  favorite: joi.boolean(),
});

const updateContact = joi.object({
  name: joi.string().pattern(/^[a-zA-Z\s'’ʼ-]{3,30}$/),
  email: joi.string().email(),
  phone: joi.string(),
  favorite: joi.boolean(),
});

const updateStatusContact = joi.object({
  favorite: joi.boolean().required(),
});

const id = joi.object({
  id: joi.string().custom(checkObjectId).required(),
});

const queryParams = joi.object({
  page: joi.number(),
  limit: joi.number().custom(checkLimit),
  favorite: joi.boolean(),
});

exports.contactsSchema = {
  contact,
  updateContact,
  updateStatusContact,
  id,
  queryParams,
};
