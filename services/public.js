const path = require('path');
const { BadRequest } = require('http-errors');
const { getDirPath } = require('../config');
const { fsOperations } = require('../helpers');

const uploadAvatar = async (file, endpoint) => {
  if (!file)
    throw BadRequest(
      'Error file format. Supported types: ".jpeg", ".jpg", ".png"',
    );

  const { filename, path: oldPath } = file;

  const newPath = path.resolve(getDirPath().avatars, filename);

  fsOperations.replaceFile(oldPath, newPath);

  return { avatarUrl: endpoint + filename };
};

exports.publicService = {
  uploadAvatar,
};
