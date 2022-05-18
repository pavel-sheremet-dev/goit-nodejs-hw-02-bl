const serializeContact = ({ id, name, email, phone, favorite, owner }) => ({
  id,
  name,
  email,
  phone,
  favorite,
  owner,
});

const serializeContactResponce = contact => ({
  contact: serializeContact(contact),
});

const serializeContactsListResponce = (contacts, responseFields) =>
  Object.keys(responseFields).reduce(
    (acc, field) => ({ ...acc, [field]: responseFields[field] }),
    {
      contacts: contacts.map(serializeContact),
    },
  );

exports.contactsSerializes = {
  serializeContactResponce,
  serializeContactsListResponce,
};
