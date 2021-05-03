/**
 * Distribution of form actions
 * @function
 * @param {object} [form]
 */
function formActions(form){
    if(form.querySelector('[data-action]').getAttribute('data-action') === 'sendEmail'){
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
    let dataSend = form.querySelector('[data-action]')
    let to = dataSend.getAttribute('data-to') ? dataSend.getAttribute('data-to') : null;
    let from = dataSend.getAttribute('data-from') ? dataSend.getAttribute('data-from') : null;
    let subject = dataSend.getAttribute('data-subject') ? dataSend.getAttribute('data-subject') : null;
    let honeypots = form.querySelectorAll('[data-hnpt]').length !== 0
        ? form.querySelectorAll('[data-hnpt]')
        : null;
    let submit = form.querySelector('button[type="submit"]');
    let submitValue = submit.innerHTML;

    submit.innerHTML = "Envoie en cours..."
    submit.getAttribute('data-disable-class').split(' ').forEach(disableClass => {
        submit.classList.add(disableClass);
    })

    if(await sendEmail(form, from, to, subject, honeypots) === 'success'){
        submit.innerHTML = submitValue;
        submit.getAttribute('data-disable-class').split(' ').forEach(disableClass => {
            submit.classList.remove(disableClass);
        })
        showNotification('Message envoyé avec succès !', 'success')
    } else {
        showNotification("Erreur lors de l'envoie de votre message !", 'error')
    }
}