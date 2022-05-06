const { User } = require('../models');
const { NotFound, Forbidden } = require('http-errors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const signUp = async reqParams => {
  const hashPassword = await createHashPassword(reqParams.password);
  const user = await User.create({ ...reqParams, password: hashPassword });
  return user;
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new NotFound('User not found. Please check email or sign up');

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) throw new Forbidden('Password is wrong');

  const token = createToken(user);

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

const updateSubscription = async subscription => {};

// heplers

const createHashPassword = async password => {
  try {
    const hashPassword = await bcryptjs.hash(
      password,
      parseInt(process.env.ROUNDS) ?? 10,
    );
    return hashPassword;
  } catch (error) {
    throw new Error('something went wrong.');
  }
};

const comparePassword = async (password, requiredPassword) => {
  try {
    const isValidPassword = await bcryptjs.compare(password, requiredPassword);
    return isValidPassword;
  } catch (error) {
    throw new Error('something went wrong');
  }
};

const createToken = user => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign({ uid: user.id, permissions: [user.subscription] }, secret, {
    expiresIn,
  });
};

exports.usersService = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateSubscription,
};
