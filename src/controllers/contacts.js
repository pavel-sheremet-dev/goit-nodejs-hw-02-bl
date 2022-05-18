const { contactsService: service } = require('../services');
const { contactsSerializes } = require('../serialize');

const { serializeContactResponce, serializeContactsListResponce } =
  contactsSerializes;

const addContact = async (req, res) => {
  const contact = await service.addContact({ ...req.body, owner: req.user.id });
  res.status(201).send(serializeContactResponce(contact));
};

const getContacts = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;

  const { contacts, totalContacts } = await service.getContacts(
    { page, limit },
    { owner, favorite },
  );

  res.status(200).send(
    serializeContactsListResponce(contacts, {
      totalContacts,
      page,
      limit,
    }),
  );
};

const getContact = async (req, res) => {
  const contact = await service.getContact(req.params.id, req.user.id);
  res.status(200).send(serializeContactResponce(contact));
};

const updateContact = async (req, res) => {
  const contact = await service.updateContact(
    req.params.id,
    req.body,
    req.user.id,
  );
  res.status(200).send(serializeContactResponce(contact));
};

const deleteContact = async (req, res) => {
  await service.deleteContact(req.params.id, req.user.id);
  res.status(204).send();
};

exports.contactsController = {
  addContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
};
