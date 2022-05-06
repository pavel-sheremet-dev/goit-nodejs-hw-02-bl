const getSubscriptions = () => ({
  all: ['starter', 'pro', 'business', 'super_admin'],
  starter: 'starter',
  pro: 'pro',
  business: 'business',
  super: 'super_admin',
});

exports.config = { getSubscriptions };
