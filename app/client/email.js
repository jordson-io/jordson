/**
 * Send email
 * @function
 * @param {formData} [data]
 * @param {string} [from]
 * @param {string} [to]
 * @param {string} [subject]
 * @param {nodeList} [honeypots]
 * @returns {Promise<string>}
 */
async function sendEmail( data, from, to, subject, honeypots ){
    let formData = new FormData(data);
    let honeypotCheck = true;
    let dataFormRemove = [];

    /**
     * HoneyPot Check
     */
    if(honeypots !== null){
        Array.prototype.forEach.call(honeypots, honeypot => {
            dataFormRemove.push(honeypot.name)
        });
    }

    if( honeypotCheck === true ){

        /**
         * Removal of unnecessary items before sending the request
         */
        let dataFormSorted = Array.from(formData);
        dataFormRemove.push('rgpd');

        for (let i in dataFormRemove) {
            let ItemIndex = dataFormSorted.findIndex(dataFormSorted => dataFormSorted[0] === dataFormRemove[i]);
            dataFormSorted.splice(ItemIndex, 1)
        }

        /**
         * Preparing request data
         */
        let sendData = {}
        dataFormSorted.forEach(elements => {
            sendData[`${elements[0]}`] = elements[1];
        })
        sendData.from = from;
        sendData.to = to;
        sendData.subject = subject;

        /**
         * Sending Request
         */
        let resp = await fetch('/api?formAction=emailsend', {
            method: "POST",
            body: JSON.stringify(sendData)
        });

        return await resp.text()
    }
}
