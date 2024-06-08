const nodeMailer = require('nodemailer');

const makeid = function (length, flag = true) {
  let result = '';
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  if (flag) {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const sendAuth = async (email, subject, contentHTML) => {
  try {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    await transporter.sendMail({
        from: 'no-reply@example.com',
        to: email,
        subject: subject,
        html: contentHTML
    })
    return true;
  } catch (error) {
    return error.message;
  }
}


module.exports = {
  makeid,
  validateEmail,
  sendAuth
}
