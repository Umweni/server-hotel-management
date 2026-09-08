const transporter = require('../config/mailer');

const sendEmail = async (
    to,
    subject,
    html
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to,

        subject,

        html
    });
};



module.exports = sendEmail;