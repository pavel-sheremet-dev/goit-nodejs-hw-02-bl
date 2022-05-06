const serializeUser = ({ id, email, subscription }) => ({
  id,
  email,
  subscription,
});

const serializeSignInResponce = ({ user, token }) => ({
  user: serializeUser(user),
  token,
});

exports.usersSerializes = { serializeUser, serializeSignInResponce };
