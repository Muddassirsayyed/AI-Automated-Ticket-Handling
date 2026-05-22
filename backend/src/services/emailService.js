const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendEmail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Email] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

const emailTemplates = {
  ticketCreated: (ticket) => ({
    subject: `Ticket #${ticket._id} Created - ${ticket.title}`,
    html: `<h2>Your ticket has been received</h2><p>Title: ${ticket.title}</p><p>Category: ${ticket.category}</p><p>Priority: ${ticket.priority}</p><p>We'll respond shortly.</p>`
  }),
  ticketUpdated: (ticket) => ({
    subject: `Ticket #${ticket._id} Updated - Status: ${ticket.status}`,
    html: `<h2>Your ticket status has been updated</h2><p>Status: ${ticket.status}</p><p>Title: ${ticket.title}</p>`
  })
};

module.exports = { sendEmail, emailTemplates };
