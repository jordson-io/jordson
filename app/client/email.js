/**
 * Send email
 * @function
 * @param {formData} [data]
 * @param {string} [from]
 * @param {string} [to]
 * @param {string} [subject]
 * @param {nodeList} [honeypots]
 * @returns {Promise<void>}
 */
async function sendEmail( data, from, to, subject, honeypots ){

    // TODO: Au clic passer le bouton en "Envoie en cours..."
    // TODO: Si erreur repasser le bouton en status initial (Envoyer)
    // TODO: Si envoie de l'email ok, réinitialiser le formulaire.

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

        let dataFormSorted = Array.from(formData);
        dataFormRemove.push('rgpd');

        for (let i in dataFormRemove) {
            let ItemIndex = dataFormSorted.findIndex(dataFormSorted => dataFormSorted[0] === dataFormRemove[i]);
            dataFormSorted.splice(ItemIndex, 1)
        }

        let data = {}
        dataFormSorted.forEach(elements => {
            data[`${elements[0]}`] = elements[1];
        })
        data.from = from;
        data.to = to;
        data.subject = subject;

        let resp = await fetch('/api?action=emailsend', {
            method: "POST",
            body: JSON.stringify(data)
        });

        if(await resp.text() === 'success'){
            showNotification('Votre email à bien été envoyé !', 'success')
        } else {
            showNotification("Veuillez contacter l'administrateur du site", 'error', 'Une erreur est survenue')
        }

    }
}
