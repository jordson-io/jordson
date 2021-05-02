
function formActions(form){
    let dataSend = form.querySelector('[data-action]')
    if(dataSend.getAttribute('data-action') === 'sendEmail'){
        let to = dataSend.getAttribute('data-to') ? dataSend.getAttribute('data-to') : null;
        let from = dataSend.getAttribute('data-from') ? dataSend.getAttribute('data-from') : null;
        let subject = dataSend.getAttribute('data-subject') ? dataSend.getAttribute('data-subject') : null;
        let honeypots = form.querySelectorAll('[data-hnpt]').length !== 0
            ? form.querySelectorAll('[data-hnpt]')
            : null;

        sendEmail(form, from, to, subject, honeypots);
    }
}