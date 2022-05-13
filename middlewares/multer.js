const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const { getDirPath, config } = require('../config');

const storage = multer.diskStorage({
  destination: getDirPath().temp,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  filename: (req, file, cb) => {
    const fileExtention = path.extname(file.originalname);
    return cb(null, `${file.fieldname}-${uuid()}${fileExtention}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isValidMimetype = config
    .getMimetypes()
    .some(mimetype => mimetype === file.mimetype);
  if (!isValidMimetype) {
    req.fileValidationError = 'Forbidden extension';
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

exports.upload = upload;
