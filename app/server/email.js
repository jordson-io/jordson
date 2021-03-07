import nodeMailer from "nodemailer";
import logSys from "./msgSystem.js";
import { gConfig } from "../config.js";

/**
 * Manage email sending
 * @class
 */
export default class Email {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: gConfig.mail.host,
      port: gConfig.mail.port,
      auth: {
        user: gConfig.mail.user,
        pass: gConfig.mail.pass,
      },
    });
  }

  /**
   * Sending email
   * @method
   * @param {object} [data] to create and send email
   * @returns {Promise<void>}
   */
  async send(data) {
    await logSys("EMAIL: Generate email");
    this.message = {
      from: "ne-pas-repondre@jord.com",
      to: data.email,
      subject: data.subject,
      text: `${data.message}`,
      html: `${data.message}`,
    };

    await this.transporter.sendMail(this.message, function (err, res) {
      if (err) {
        logSys(err, "error");
      } else {
        logSys("EMAIL: Email SEND", "success");
        logSys(`EMAIL: Response >> ${res.response}`);
        logSys(`EMAIL: MessageID >> ${res.messageId}`);
      }
    });
  }
}
