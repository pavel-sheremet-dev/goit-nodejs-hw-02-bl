const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async msg => {
  try {
    const sendedMessage = await sgMail.send(msg);
    return sendedMessage[0].statusCode;
  } catch (error) {
    return null;
  }
};

const retrySendEmail = (sendMailFunction, count = 2, interval = 20) => {
  setTimeout(async () => {
    const status = await sendMailFunction();
    if (!status && count - 1) {
      retrySendEmail(sendMailFunction, count - 1);
      return;
    }
    return status;
  }, interval * 1000);
};

const sendMailWithControl = async msg => {
  const sendMailClosureFunc = msg => async () => await sendMail(msg);
  const sendMailLocal = sendMailClosureFunc(msg);
  const status = await sendMailLocal();
  if (!status) {
    retrySendEmail(sendMailLocal);
  }
  return status;
};

const getVerificationUrl = (baseRoutePath, verificationToken) =>
  `${process.env.SERVER_BASE_URL}${baseRoutePath}/verify/${verificationToken}`;

const sendVerificationMail = async (to, baseRoutePath, verificationToken) => {
  const verificationUrl = getVerificationUrl(baseRoutePath, verificationToken);

  const msg = {
    to,
    from: process.env.SENDGRID_SENDER,
    subject: '[Backend] Please confirm your email address',
    text: `Go to this link to confirm your email: ${verificationUrl}`,
    html: `<a href="${verificationUrl}">Click to confirm your email</a>`,
    // templateId: 'd-fdc51d8492a047879ae5e8a4ea903125',
    // dynamicTemplateData: {
    //   verificationUrl,
    // },
  };

  return await sendMailWithControl(msg);
};

exports.mailService = { sendVerificationMail };
