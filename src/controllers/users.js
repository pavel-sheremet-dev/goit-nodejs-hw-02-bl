const { usersService: service } = require('../services');
const { usersSerializes } = require('../serialize');

const { serializeUser, serializeSignInResponce, serializeUserAvatarUrl } =
  usersSerializes;

const signUp = async (req, res) => {
  const user = await service.signUp(req.body, req.baseUrl);
  res.status(201).send(serializeUser(user));
};

const verifyUser = async (req, res) => {
  const userEmail = await service.verifyUser(req.params.verificationToken);
  res
    .status(200)
    .send({ message: `User '${userEmail}' has been successfully verified` });
};

const sendVerifyEmail = async (req, res) => {
  const userEmail = await service.sendVerifyEmail(req.body.email, req.baseUrl);
  res
    .status(200)
    .send({ message: `Verification email has been sent to '${userEmail}'` });
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

const updateAvatar = async (req, res) => {
  const { user, file, url } = req;
  const updatedUser = await service.updateAvatar(user, file, url);
  res.status(201).send(serializeUserAvatarUrl(updatedUser));
};

exports.usersController = {
  signUp,
  verifyUser,
  sendVerifyEmail,
  signIn,
  signOut,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
