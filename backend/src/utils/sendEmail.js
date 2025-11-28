const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: 'xtblnnwmtyxcfrpg'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // Define email options
  const mailOptions = {
    from: `"MECOSO Admin" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">MECOSO</h1>
        </div>
        <div style="padding: 30px; background-color: #f7fafc;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${options.message ? `<p style="color: #4a5568; line-height: 1.6; white-space: pre-line;">${options.message}</p>` : ''}
          </div>
        </div>
        <div style="padding: 20px; text-align: center; color: #718096; font-size: 12px;">
          <p>© ${new Date().getFullYear()} MECOSO. All rights reserved.</p>
        </div>
      </div>
    `
  };
  
  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
};

module.exports = sendEmail;