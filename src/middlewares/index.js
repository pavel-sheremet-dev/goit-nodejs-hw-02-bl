const { commonMiddlewares } = require('./common');
const { usersMiddlewares } = require('./users');
const { upload } = require('./multer');

exports.commonMiddlewares = commonMiddlewares;
exports.usersMiddlewares = usersMiddlewares;
exports.upload = upload;
