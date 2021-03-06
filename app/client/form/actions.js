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
    submit.getAttribute('data-disable-class').split(/ /g).forEach((disableClass) => {
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
        let ItemIndex = dataFormSorted.findIndex((dataFormSorted) => dataFormSorted[0] === dataFormRemove[i]);
        dataFormSorted.splice(ItemIndex, 1)
    }

    /**
     * Preparing request data
     */
    dataFormSorted.forEach((elements) => {
        sendData[`${elements[0]}`] = elements[1];
    })


    let formId = '0';
    const forms = document.querySelectorAll('form');
    if(forms.length > 1){
        let id = -1;
        forms.forEach((formNode) => {
            id++;
            if(formNode.innerHTML === form.innerHTML){
                formId = id.toString();
            }
        })
    }
    sendData.id = `${pagesRoutes.currentPage.fileName}|${formId}`

    /**
     * Sending request
     */
    const resp = await fetch('/api?action=formProcessing', {
        method: "POST",
        body: JSON.stringify(sendData)
    });

    const response = await resp.text();

    if(response === "true"){
        submit.innerHTML = submitValue;
        let classes = submit.getAttribute('data-disable-class');
        if(classes){
            classes.split(' ').forEach(disableClass => {
                submit.classList.remove(disableClass);
            })
        }
        showNotification('Message envoyé avec succès !', 'success')
    } else {
        showNotification("Erreur lors de l'envoie de votre message !", 'error')
    }
}