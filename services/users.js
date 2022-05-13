const { User } = require('../models');
const { NotFound, Forbidden, BadRequest } = require('http-errors');
const {
  auth,
  createAvatarUrl,
  fsOperations,
  resizeImage,
} = require('../helpers');
const { config, getDirPath } = require('../config');
const path = require('path');

const superAdmin = config.getSubscriptions().super;

const signUp = async reqParams => {
  const { email, password } = reqParams;
  const hashPassword = await auth.createHashPassword(password);
  const user = await User.create({
    ...reqParams,
    password: hashPassword,
    avatarUrl: createAvatarUrl(email),
  });

  return user;
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new NotFound('User not found. Please check email or sign up');

  const isValidPassword = await auth.comparePassword(password, user.password);

  if (!isValidPassword) throw new Forbidden('Password is wrong');

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
  if (!file)
    throw BadRequest(
      'Error file format. Supported types: ".jpeg", ".jpg", ".png"',
    );

  const { filename, path: oldPath } = file;
  const { id, avatarUrl: oldAvatarUrl } = user;

  await resizeImage(oldPath);

  const newPath = path.join(getDirPath().avatars, filename);

  await fsOperations.replaceFile(oldPath, newPath);

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
  signIn,
  signOut,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
