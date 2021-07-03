import nodeMailer from "nodemailer";
import logSys from "../core/msgSystem.js";
import gConfig from "./config.mjs";

let gConf = new gConfig();

// TODO: Fixer la vulnérabilité du \n dans le subject du message.

/**
 * Manage email sending
 * @class
 */
export default class Email {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: gConf.mail.host,
      port: gConf.mail.port,
      auth: {
        user: gConf.mail.user,
        pass: gConf.mail.pass,
      },
    });
  }

  /**
   * Sending email
   * @method
   * @param {object} [data] to create and send email
   * @returns {Promise<string>}
   */
  async send(data) {
    await logSys("EMAIL: Generate email");

    this.message = {
      subject: data.subject,
      text: `${data.message}`,
      html: `${data.message}`,
    };

    const regex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i);

		if(!data.email.match(regex)){
      return "rejected"
    }

    this.message.to = gConf.mail.address[data.to] || gConf.mail.address.contact;
    this.message.from = gConf.mail.address[data.from] || gConf.mail.address.noreply;
    this.message.replyTo = data[data.replyTo] || this.message.from;

    return new Promise( async resolve => {
      await this.transporter.sendMail(this.message,function (err, res) {
        if (err) {
          logSys(err, "error");
          return err;
        } else {
          logSys("EMAIL: Email SEND", "success");
          logSys(`EMAIL: Response >> ${res.response}`);
          logSys(`EMAIL: MessageID >> ${res.messageId}`);

          if(res.accepted.length > 0 && res.rejected.length === 0){
            resolve("success")
          } else {
            resolve("rejected")
          }
        }
      })
    })
  }
}
