const path = require('path');
const { getDirPath } = require('../config');
const { fsOperations } = require('../helpers');

const uploadAvatar = async (file, endpoint) => {
  const { filename, path: oldPath } = file;

  const newPath = path.resolve(getDirPath().avatars, filename);

  fsOperations.replaceFile(oldPath, newPath);

  return { avatarUrl: endpoint + filename };
};

exports.publicService = {
  uploadAvatar,
};
