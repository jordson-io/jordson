/**
 * Send email
 * @function
 * @param {object} [data]
 * @param {string} [from]
 * @param {string} [to]
 * @param {string} [replyTo]
 * @param {string} [subject]
 * @returns {Promise<string>}
 */
async function sendEmail( data, from, to, subject, replyTo = null ){

        let sendData = data;
        sendData.from = from;
        sendData.to = to;
        sendData.replyTo = replyTo || from;
        sendData.subject = subject;

        /**
         * Sending Request
         */
        let resp = await fetch('/api?action=sendEmail', {
            method: "POST",
            body: JSON.stringify(sendData)
        });

        return await resp.text()

}
