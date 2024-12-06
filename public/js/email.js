const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
const path = require("path");

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email), (this.firstName = user.name.split(" ")[0]);
    this.url = url;
    this.from = `Affan Sayeed ${process.env.EMAIL_FROM}`;
  }

  async newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, "../../views/email", `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    const transporter = await this.newTransport();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Food Delivery App");
  }
  async sendOrderConfirmed() {
    await this.send("orderConfirmed", "Your order has been confirmed");
  }
};
