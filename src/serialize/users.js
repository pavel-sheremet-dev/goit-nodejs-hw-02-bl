const serializeUser = ({ id, email, subscription, avatarUrl }) => ({
  id,
  email,
  subscription,
  avatarUrl,
});

const serializeSignInResponce = ({ user, token }) => ({
  user: serializeUser(user),
  token,
});

const serializeUserAvatarUrl = ({ avatarUrl }) => ({
  avatarUrl,
});

exports.usersSerializes = {
  serializeUser,
  serializeSignInResponce,
  serializeUserAvatarUrl,
};
