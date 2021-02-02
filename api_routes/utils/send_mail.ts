import nodemailer, { SendMailOptions, Transporter } from "nodemailer";

function send_mail(subject: string, to: string, html: string) {
  return new Promise((resolve, reject) => {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 25,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions: SendMailOptions = {
      headers: {
        From: "noreply@mtx.ru"
      },
      from: "noreply@mtx.ru",
      to,
      subject,
      html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

export default send_mail;
