const { Router } = require('express');

const { usersSchema: schema } = require('../../schemas');
const { usersController: controller } = require('../../controllers');
const {
  commonMiddlewares,
  usersMiddlewares,
  upload,
} = require('../../middlewares');
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

router.get('/verify/:verificationToken', ctrlWrapper(controller.verifyUser));

router.post(
  '/verify',
  validateRequest(schema.verify),
  ctrlWrapper(controller.sendVerifyEmail),
);

router.post(
  '/signin',
  validateRequest(schema.signing),
  ctrlWrapper(controller.signIn),
);

router.get('/signout', authhorize(), ctrlWrapper(controller.signOut));

router.get('/current', authhorize(), ctrlWrapper(controller.getCurrentUser));

router.patch(
  '/',
  authhorize(superAdmin),
  validateRequest(schema.updateSubscription),
  ctrlWrapper(controller.updateSubscription),
);

router.patch(
  '/avatars',
  authhorize(),
  upload.single('avatar'),
  ctrlWrapper(controller.updateAvatar),
);

module.exports = router;
