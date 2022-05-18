const path = require('path');

const getSubscriptions = () => ({
  all: ['starter', 'pro', 'business', 'super_admin'],
  starter: 'starter',
  pro: 'pro',
  business: 'business',
  super: 'super_admin',
});

const getMimetypes = () => ['image/jpeg', 'image/png'];

const getDirPath = () => ({
  temp: path.resolve(process.cwd(), 'temp'),
  public: path.resolve(process.cwd(), 'public'),
  avatars: path.resolve(process.cwd(), 'public', 'avatars'),
});

exports.config = { getSubscriptions, getDirPath, getMimetypes };
