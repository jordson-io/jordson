/**
 * Distribution of form actions
 * @function
 * @param {object} [form]
 */
function formActions(form){
    if(form.querySelector('[data-form-action]').getAttribute('data-form-action') === 'sendEmail'){
        actionSendEmail(form)
    }
}

/**
 * Action "sending email"
 * @function
 * @param {object} [form]
 * @returns {Promise<void>}
 */
async function actionSendEmail(form){

    /**
     * Pre-processing of the form
     */
    let submit = form.querySelector('button[type="submit"]');
    let submitValue = submit.innerHTML;

    submit.innerHTML = "Envoie en cours..."
    submit.getAttribute('data-disable-class').split(' ').forEach(disableClass => {
        submit.classList.add(disableClass);
    })


    /**
     * Allocation of variables
     */
    const dataSend = form.querySelector('[data-form-action]');
    let dataFormSorted = Array.from(new FormData(form));
    let dataFormRemove = [];
    let sendData = {};

    const to = dataSend.getAttribute('data-to')  || 'contact';
    const from = dataSend.getAttribute('data-from') || 'site';
    const subject = dataSend.getAttribute('data-subject') || 'Email';
    const replyTo = dataSend.getAttribute('data-replyTo') || from;

    const honeypots = form.querySelectorAll('[data-hnpt]');
    const inputsRemove = form.querySelectorAll('[data-input-remove]');

    /**
     * Removal of unnecessary items before sending the request
     */
    if(honeypots.length !== 0){
        Array.prototype.forEach.call(honeypots, honeypot => {
            dataFormRemove.push(honeypot.name)
        });
    }

    if(inputsRemove.length !== 0){
        Array.prototype.forEach.call(inputsRemove, inputRemove => {
            dataFormRemove.push(inputRemove.name)
        });
    }

    for (let i in dataFormRemove) {
        let ItemIndex = dataFormSorted.findIndex(dataFormSorted => dataFormSorted[0] === dataFormRemove[i]);
        dataFormSorted.splice(ItemIndex, 1)
    }

    /**
     * Preparing request data
     */
    dataFormSorted.forEach(elements => {
        sendData[`${elements[0]}`] = elements[1];
    })


    let formId = '0';
    if(document.querySelectorAll('form').length > 1){
        let id = -1;
        document.querySelectorAll('form').forEach(formNode => {
            id++;
            if( formNode.innerHTML === form.innerHTML){
                formId = id.toString();
            }
        })
    }
    sendData.id = `${pagesRoutes.currentPage.fileName}|${formId}`

    /**
     * Sending request
     */
    let resp = await fetch('/api?action=formProcessing', {
        method: "POST",
        body: JSON.stringify(sendData)
    });

    let response = await resp.text();
    console.log(response);

    // if(await sendEmail(sendData, from, to, subject, replyTo) === 'success'){
    //     submit.innerHTML = submitValue;
    //     submit.getAttribute('data-disable-class').split(' ').forEach(disableClass => {
    //         submit.classList.remove(disableClass);
    //     })
    //     showNotification('Message envoyé avec succès !', 'success')
    // } else {
    //     showNotification("Erreur lors de l'envoie de votre message !", 'error')
    // }
}