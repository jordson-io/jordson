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

    // TODO: Ajouter la gestion des erreurs/success
    // TODO: Gérer le bouton d'envoi après clic
    // TODO: Créer une fonction pour vérifier les types des champs (email, textes...)

    let formData = new FormData(data);
    let honeypotCheck = true;
    let dataFormRemove = [];

    /**
     * HoneyPot Check
     */
    if(honeypots !== null){
        Array.prototype.forEach.call(honeypots, honeypot => {
            dataFormRemove.push(honeypot.name)
            if(honeypot.value !== honeypot.getAttribute('data-hnpt'))
                honeypotCheck = false
        });
    }

    if( honeypotCheck === true ){

        /**
         * Check RGPD
         */
        if(!formData.get('rgpd')){

        console.log('ERREUR RGPD NON VALIDÉ');

      } else {

        let dataFormSorted = Array.from(formData);
        dataFormRemove.push('rgpd');

        for (let i in dataFormRemove) {
            let ItemIndex = dataFormSorted.findIndex(dataFormSorted => dataFormSorted[0] === dataFormRemove[i]);
            dataFormSorted.splice(ItemIndex, 1)
        }

        dataFormSorted = Object.assign({}, dataFormSorted);
        dataFormSorted.from = from;
        dataFormSorted.to = to;
        dataFormSorted.subject = subject;

        let resp = await fetch('/api?action=emailsend', {
            method: "POST",
            body: JSON.stringify(dataFormSorted)
        });

        //TODO: Traiter la réponse du serveur
        console.log(await resp.json())

      }
    }
}
