const errors = require('http-errors');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    required: [true, 'Set email for contact'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'Set phone for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const populateOwner = function (...fieds) {
  return function () {
    this.populate('owner', fieds);
  };
};

const schemaErrorHandling = (error, doc, next) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(
      new errors[409](
        `Contact with email "${error.keyValue.email}" already exist`,
      ),
    );
  } else {
    next();
  }
};

contactsSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  populateOwner('email'),
);
contactsSchema.post(['save', 'findOneAndUpdate'], schemaErrorHandling);

exports.Contact = mongoose.model('Contact', contactsSchema, 'contacts');
