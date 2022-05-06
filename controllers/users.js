const { usersService: service } = require('../services');
const { usersSerializes } = require('../serialize');

const { serializeUser, serializeSignInResponce } = usersSerializes;

const signUp = async (req, res) => {
  const user = await service.signUp(req.body);
  res.status(201).send(serializeUser(user));
};

const signIn = async (req, res) => {
  const user = await service.signIn(req.body);
  res.status(200).send(serializeSignInResponce(user));
};

const signOut = async (req, res) => {
  await service.signOut(req.user.id);
  res.status(204).send();
};

const getCurrentUser = async (req, res) => {
  const user = await service.getCurrentUser(req.user.id);
  res.status(200).send(serializeUser(user));
};

const updateSubscription = async (req, res) => {
  const user = await service.updateSubscription(req.body);
  res.status(201).send(serializeUser(user));
};

exports.usersController = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateSubscription,
};
