const express = require('express');
const { config } = require('../../config');
const { publicController: controller } = require('../../controllers/public');
const { usersSchema: schema } = require('../../schemas');
const {
  upload,
  usersMiddlewares,
  commonMiddlewares,
} = require('../../middlewares');

const { ctrlWrapper, validateRequest } = commonMiddlewares;
const { authhorize } = usersMiddlewares;
const superAdmin = config.getSubscriptions().super;

const router = express.Router();

router.post(
  '/avatars',
  authhorize(superAdmin),
  upload.single('avatar'),
  validateRequest(schema.avatar, 'file'),
  ctrlWrapper(controller.uploadAvatar),
);

module.exports = router;
