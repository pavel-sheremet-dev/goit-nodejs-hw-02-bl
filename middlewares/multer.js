const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const { getDirPath, config } = require('../config');
const { BadRequest } = require('http-errors');

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
    cb(
      new BadRequest(
        'Error file format. Supported types: ".jpeg", ".jpg", ".png"',
      ),
    );
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

exports.upload = upload;
