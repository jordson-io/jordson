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
async function sendEmail( data: object, from: string, to: string, subject: string, replyTo: string | null ): Promise<string>{

        let sendData: object = data;
        sendData.from = from;
        sendData.to = to;
        sendData.replyTo = replyTo || from;
        sendData.subject = subject;

        console.log(sendData);

        /**
         * Sending Request
         */
        const resp: Response = await fetch('/api?action=sendEmail', {
            method: "POST",
            body: JSON.stringify(sendData)
        });

        return await resp.text()

}
