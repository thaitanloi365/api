import _ from "lodash";
import nodemailer from "nodemailer";
import mailgunTransport from "nodemailer-mailgun-transport";
import Promise from "bluebird";
import path from "path";
import fs from "fs";

export default class Mailer {
  /**
   * @param {import("@Types").MailerOptions} mailOptions
   */
  constructor(mailOptions) {
    this.options = { auth: { api_key: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN } };
    this.mailOptions = mailOptions;
  }

  getHtml(templateName, data) {
    const templateContent = fs.readFileSync(path.resolve(__dirname, templateName), "UTF-8");
    const compiled = _.template(templateContent, { interpolate: /\{\{(.+?)\}\}/g });
    return compiled(data);
  }

  /**
   * @param {import("@Types").MailerSendData} data
   */
  sendMail(data = null) {
    if (this.mailOptions.html) {
      this.mailOptions.html = this.getHtml(this.mailOptions.html, data);
    }

    return new Promise((resolve, reject) => {
      const mailer = nodemailer.createTransport(mailgunTransport(this.options));
      mailer.sendMail(this.mailOptions, (err, response) => {
        if (err) {
          reject(err);
        } else if (!response) {
          reject(new Error("Invalid response from mailer server. Check the domain name variable."));
        }
        if (process.env.NODE_ENV === "development") {
          console.log(`Email sent with options: ${JSON.stringify(this.mailOptions)}`);
        }
        resolve(response);
      });
    });
  }
}
