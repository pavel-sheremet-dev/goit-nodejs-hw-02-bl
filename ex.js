const gravatar = require('gravatar');

const avatarUrl = gravatar.url('mymail2@mail.com', { protocol: 'https' });

console.log('avatarUrl', avatarUrl);
