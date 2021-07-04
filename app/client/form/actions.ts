/**
 * Distribution of form actions
 * @function
 * @param {object} [form]
 */
function formActions(form: HTMLFormElement){
    if(form.querySelector('[data-form-action]').getAttribute('data-form-action') === 'sendEmail'){
        // TODO: Terminer le retour de la requete sendEmail
        actionSendEmail(form)
    }
}

/**
 * Action "sending email"
 * @function
 * @param {object} [form]
 * @returns {Promise<void>}
 */
async function actionSendEmail(form: HTMLFormElement){

    /**
     * Pre-processing of the form
     */
    let submit:HTMLElement | null = form.querySelector('button[type="submit"]');
    let submitValue: string | undefined = submit?.innerHTML;

    submit?.innerHTML = "Envoie en cours..."
    submit?.getAttribute('data-disable-class').split(/ /g).forEach((disableClass: string) => {
        submit?.classList.add(disableClass);
    })


    /**
     * Allocation of variables
     */
    const dataSend: HTMLElement | null = form.querySelector('[data-form-action]');
    let dataFormSorted: [string, (File | string)][] = Array.from(new FormData(form));
    let dataFormRemove: string[] = [];
    let sendData: object = {};

    const to = dataSend?.getAttribute('data-to')  || 'contact';
    const from = dataSend?.getAttribute('data-from') || 'site';
    const subject = dataSend?.getAttribute('data-subject') || 'Email';
    const replyTo = dataSend?.getAttribute('data-replyTo') || from;

    const honeypots: NodeListOf<HTMLElement> = form.querySelectorAll('[data-hnpt]');
    const inputsRemove: NodeListOf<HTMLElement> = form.querySelectorAll('[data-input-remove]');

    /**
     * Removal of unnecessary items before sending the request
     */
    if(honeypots.length !== 0){
        Array.prototype.forEach.call(honeypots, honeypot => {
            dataFormRemove?.push(honeypot.name)
        });
    }

    if(inputsRemove.length !== 0){
        Array.prototype.forEach.call(inputsRemove, inputRemove => {
            dataFormRemove?.push(inputRemove.name)
        });
    }

    for (let i: number in dataFormRemove) {
        let ItemIndex: number = dataFormSorted.findIndex((dataFormSorted: string[]) => dataFormSorted[0] === dataFormRemove[i]);
        dataFormSorted.splice(ItemIndex, 1)
    }

    // TODO: Reprendre le refcto à partir d'ici (voir comment est structuré le dataFormSorted et définir le type element
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