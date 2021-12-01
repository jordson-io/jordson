'use strict';

/** Copyright © 2021 André LECLERCQ
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import nodeMailer from "nodemailer";
import { log } from "../env/logSystem.js";
import loadConfig from "./loadConfig.mjs";

const gConfig = new loadConfig();

// TODO: Fixer la vulnérabilité du \n dans le subject du message.

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
     * @returns {Promise<string>}
     */
    async send(data) {
        await log.info("EMAIL: Generate email");

        this.message = {
            subject: data.subject,
            text: `${data.message}`,
            html: `${data.message}`,
        };

        const emailAddressIncorrect = () => {
          return !data.email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i)
        }

        if ( emailAddressIncorrect() ) {
            return "rejected";
        }

        this.message.to = gConfig.mail.address[data.to] || gConfig.mail.address.contact;
        this.message.from = gConfig.mail.address[data.from] || gConfig.mail.address.noreply;
        this.message.replyTo = data[data.replyTo] || this.message.from;

        return new Promise(async resolve => {
          await this.transporter.sendMail(this.message, (err, res) => {
            if (err) {
                log.error(err);
                return err;
            } else {

              const isAcceptedAndNotRejected = () => {
                return (res.accepted.length > 0 && res.rejected.length === 0);
              }

              log.success("EMAIL: Email SEND");
              log.info(`EMAIL: Response >> ${res.response}`);
              log.info(`EMAIL: MessageID >> ${res.messageId}`);

              if( isAcceptedAndNotRejected() ) {
                  resolve("success");
              } else {
                  resolve("rejected");
              }
            }
          })
      })
  }
}
