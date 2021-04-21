import nodeMailer from "nodemailer";
import logSys from "../core/msgSystem.js";
import { gConfig } from "./config.js";

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
      subject: data.subject,
      text: `${data.message}`,
      html: `${data.message}`,
    };

    this.message.to = gConfig.mail.address[data.to] ? gConfig.mail.address[data.to] : gConfig.mail.address.contact;
    this.message.from = gConfig.mail.address[data.from] ? gConfig.mail.address[data.from] : gConfig.mail.address.noreply;
    this.message.replyTo = data.email ? data.email : this.message.from;

    // TODO: Gérer la réponse au client

    await this.transporter.sendMail(this.message,function (err, res) {
      if (err) {
        logSys(err, "error");
        return err;
      } else {

        logSys("EMAIL: Email SEND", "success");
        logSys(`EMAIL: Response >> ${res.response}`);
        logSys(`EMAIL: MessageID >> ${res.messageId}`);

        if(res.accepted.length > 0 && res.rejected.length === 0){
          return "success"
        }

      }
    });

  }
}
