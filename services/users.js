const { User } = require('../models');
const { NotFound, Forbidden } = require('http-errors');
const { auth } = require('../helpers');
const { config } = require('../config');

const superAdmin = config.getSubscriptions().super;

const signUp = async reqParams => {
  const hashPassword = await auth.createHashPassword(reqParams.password);
  const user = await User.create({ ...reqParams, password: hashPassword });
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

exports.usersService = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateSubscription,
};
