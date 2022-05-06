const { Router } = require('express');

const { usersSchema: schema } = require('../../schemas');
const { usersController: controller } = require('../../controllers');
const { commonMiddlewares, usersMiddlewares } = require('../../middlewares');
const { config } = require('../../config');

const superAdmin = config.getSubscriptions().super;

const { ctrlWrapper, validateRequest } = commonMiddlewares;
const { authhorize } = usersMiddlewares;

const router = Router();

router.post(
  '/signup',
  validateRequest(schema.signing),
  ctrlWrapper(controller.signUp),
);

router.post(
  '/signin',
  validateRequest(schema.signing),
  ctrlWrapper(controller.signIn),
);

router.get('/signout', authhorize(), ctrlWrapper(controller.signOut));

router.get('/current', authhorize(), ctrlWrapper(controller.getCurrentUser));

router.patch(
  '/users',
  authhorize(superAdmin),
  validateRequest(schema.updateSubscription),
  ctrlWrapper(controller.updateSubscription),
);

module.exports = router;
