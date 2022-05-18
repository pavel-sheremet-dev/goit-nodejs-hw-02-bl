const errors = require('http-errors');

const mongoose = require('mongoose');
const { config } = require('../config');
const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: config.getSubscriptions().all,
      default: config.getSubscriptions().starter,
    },
    token: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { timestamps: true },
);

const schemaErrorHandlingMiddlware = (error, doc, next) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(
      new errors[409](
        `User with email "${error.keyValue.email}" already exist`,
      ),
    );
  } else {
    next();
  }
};

usersSchema.post(['save', 'findOneAndUpdate'], schemaErrorHandlingMiddlware);

exports.User = mongoose.model('User', usersSchema, 'users');
