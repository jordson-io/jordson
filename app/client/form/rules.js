
function checkFormRules(form){
    
    cleanInputsError(form);

    if(honeypot(form) && checkRequired(form) && checkType(form) && checkRules(form)){
        formActions(form);
    }

}

function honeypot(form){
    let status = true;

    form.querySelectorAll('[data-hnpt]').forEach(honeypot => {
        if(honeypot.value !== honeypot.getAttribute('data-hnpt')){
            status = false
            showNotification("Veuillez contacter l'administrateur du site", 'error', 'Une erreur est survenue !');
        }
    });

    return status
}

function checkRequired(form){
    let status = true;

    form.querySelectorAll('input').forEach( input => {
        if(!input.hasAttribute('data-hnpt') && input.required && ((input.type === 'checkbox' && !input.checked) || !input.value)){
            callFormError(input, 'required');
            status = false;
        }
    })

    form.querySelectorAll('textarea').forEach( textarea => {
        if(!textarea.hasAttribute('data-hnpt') && textarea.required && !textarea.value.trim()){
            callFormError(textarea, 'required');
            status = false
        }
    })

    return status
}

function checkType(form){
    let status = true;
    //TODO: Types à vérifier : Password, Tel
    form.querySelectorAll('input').forEach(input => {
        if(input.type === 'email'){
            input.value = input.value.trim();
            const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
            if(!input.value.match(regex)){
                callFormError(input, 'typeEmail')
                status = false;
            }
        }
    })

    return status
}

function checkRules(form){
    let status = true;

    //

    return status


}