const Jimp = require('jimp');

exports.resizeImage = async path => {
  const image = await Jimp.read(path);
  image.cover(250, 250).write(path);
};
