import nodeMailer from 'nodemailer'
import logSys from './msgSystem.js'
import {config} from '../assets/config.js'

/**
 * Manage email sending
 * @class
 */
export default class Email {

    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        })
    }

    /**
     * Sending email
     * @method
     * @param {object} [data] to create and send email
     * @returns {Promise<void>}
     */
    async send(data) {
        await logSys('EMAIL: Generate email')
        this.message = {
            from: "ne-pas-repondre@jord.com",
            to: data.email,
            subject: data.subject,
            text: ({path: `./public/assets/views/email/${data.textFile}.txt`}),
            html: ({path: `./public/assets/views/email/${data.textFile}.html`})
        }

        await this.transporter.sendMail(this.message, function (err, res) {
            if (err) {
                logSys(err, 'error')
            } else {
                logSys('EMAIL: Email SEND', 'success')
                logSys(`EMAIL: Response >> ${res.response}`)
                logSys(`EMAIL: MessageID >> ${res.messageId}`)
            }
        })

    }
}