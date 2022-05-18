const uuid = require('uuid').v4;

const { User } = require('../models');
const {
  NotFound,
  BadRequest,
  Forbidden,
  Gone,
  PreconditionFailed,
} = require('http-errors');
const {
  auth,
  createAvatarUrl,
  fsOperations,
  resizeImage,
  mailService,
} = require('../helpers');
const { config, getDirPath } = require('../config');
const path = require('path');

const superAdmin = config.getSubscriptions().super;

const signUp = async (reqParams, baseUrl) => {
  const { email, password } = reqParams;
  const hashPassword = await auth.createHashPassword(password);

  const verificationToken = uuid();

  const user = await User.create({
    ...reqParams,
    password: hashPassword,
    avatarUrl: createAvatarUrl(email),
    verificationToken,
  });

  mailService.sendVerificationEmail(email, baseUrl, verificationToken);

  return user;
};

const verifyUser = async verificationToken => {
  const user = await User.findOne({ verificationToken });

  if (!user)
    throw new Gone(
      'Verification link is not valid, expired or has already been use',
    );

  await User.updateOne(
    { verificationToken },
    { verificationToken: null, verified: true },
  );

  return user.email;
};

const sendVerifyEmail = async (email, baseUrl) => {
  const user = await User.findOne({ email });

  if (!user)
    throw new NotFound(
      `User with email '${email}' was not found. Please check email or sign up`,
    );

  if (user.verified)
    throw new BadRequest('Verification has already been passed');

  mailService.sendVerificationEmail(email, baseUrl, user.verificationToken);

  return user.email;
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new NotFound('User not found. Please check email or sign up');

  const isValidPassword = await auth.comparePassword(password, user.password);

  if (!isValidPassword) throw new Forbidden('Password is wrong');

  if (!user.verified) {
    throw new PreconditionFailed('User was not verified ');
  }

  const token = auth.createToken(user);

  await User.findByIdAndUpdate(
    user.id,
    { token },
    {
      new: true,
      runValidators: true,
    },
  );

  return { user, token };
};

const signOut = async id => await User.findByIdAndUpdate(id, { token: null });

const getCurrentUser = async id => {
  const user = await User.findById(id);
  if (!user) throw new NotFound('User not found');
  return user;
};

const updateSubscription = async ({
  id,
  subscription,
  superAdminPassword = 'empty',
}) => {
  const isUpdatetoAdmin = subscription === superAdmin;
  const isCorrectPassword = superAdminPassword === process.env.ADMIN_PASSWORD;

  if (isUpdatetoAdmin && !isCorrectPassword) {
    throw new Forbidden('Аccess denied');
  }

  const user = await User.findByIdAndUpdate(
    id,
    { subscription },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) throw new NotFound('User not found');
  return user;
};

const updateAvatar = async (user, file, endpoint) => {
  const { filename, path: oldPath } = file;
  const { id, avatarUrl: oldAvatarUrl } = user;

  const newPath = path.join(getDirPath().avatars, filename);

  await fsOperations.replaceFile(oldPath, newPath);
  resizeImage(newPath);

  const avatarUrl = endpoint + '/' + filename;

  const userToUpdate = await User.findByIdAndUpdate(
    id,
    { avatarUrl },
    {
      new: true,
    },
  );

  const pathTodelete = userToUpdate ? oldAvatarUrl : avatarUrl;
  await fsOperations.removeOldFileFromPublic(pathTodelete);

  if (!userToUpdate) throw new NotFound('User not found');

  return userToUpdate;
};

exports.usersService = {
  signUp,
  verifyUser,
  sendVerifyEmail,
  signIn,
  signOut,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
