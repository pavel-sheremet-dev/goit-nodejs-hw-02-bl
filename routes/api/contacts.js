const { Router } = require('express');

const { contactsSchema: schema } = require('../../schemas');
const { contactsController: controller } = require('../../controllers');
const { commonMiddlewares, usersMiddlewares } = require('../../middlewares');

const { ctrlWrapper, validateRequest } = commonMiddlewares;
const { authhorize } = usersMiddlewares;

const router = Router();

router.post(
  '/',
  authhorize(),
  validateRequest(schema.contact),
  ctrlWrapper(controller.addContact),
);
router.get(
  '/',
  authhorize(),
  validateRequest(schema.queryParams, 'query'),
  ctrlWrapper(controller.getContacts),
);
router.get(
  '/:id',
  authhorize(),
  validateRequest(schema.id, 'params'),
  ctrlWrapper(controller.getContact),
);
router.put(
  '/:id',
  authhorize(),
  validateRequest(schema.id, 'params'),
  validateRequest(schema.updateContact),
  ctrlWrapper(controller.updateContact),
);
router.patch(
  '/:id/favorite',
  authhorize(),
  validateRequest(schema.id, 'params'),
  validateRequest(schema.updateStatusContact),
  ctrlWrapper(controller.updateContact),
);
router.delete(
  '/:id',
  authhorize(),
  validateRequest(schema.id, 'params'),
  ctrlWrapper(controller.deleteContact),
);

module.exports = router;
