const gravatar = require('gravatar');

exports.createAvatarUrl = email => gravatar.url(email, { protocol: 'https' });


