const { NotFound } = require('http-errors');
const { Contact } = require('../models');

const addContact = async reqParams => await Contact.create(reqParams);

const getContacts = async (pagination, filterParams) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const filter = getFilter(filterParams);

  const [contacts, totalContacts] = await Promise.all([
    Contact.find(filter).skip(skip).limit(limit),
    Contact.count(filter),
  ]);

  if (!contacts.length) throw new NotFound('Contacts not found');

  return { contacts, totalContacts };
};

const getContact = async (id, owner) => {
  const contact = await Contact.findOne({ _id: id, owner });
  if (!contact) throw new NotFound('Contact not found');
  return contact;
};

const updateContact = async (id, reqParams, owner) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    reqParams,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!contact) throw new NotFound('Contact not found');
  return contact;
};

const deleteContact = async (id, owner) => {
  const result = await Contact.deleteOne({ _id: id, owner });
  if (!result.deletedCount) throw new NotFound('Contact not found');
};

// hepler

const getFilter = params =>
  Object.keys(params).reduce((acc, key) => {
    if (params[key] === undefined) return acc;
    return { ...acc, [key]: params[key] };
  }, {});

exports.contactsService = {
  addContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
};
