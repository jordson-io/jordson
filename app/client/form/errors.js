
function callFormError(input, type, message = null){

    let errorMessage;
    let notifMessage;

    switch (type) {

        case 'required':
            errorMessage = 'Ce champ est requis, merci de le remplir';
            notifMessage = 'Un ou plusieurs champ(s) requis invalide(s)';

    }

    if(message !== null){
        errorMessage = message
    }

    showNotification(notifMessage, 'error', 'Erreur sur le formulaire');

    if( input.hasAttribute('data-error-class') ){
        input.getAttribute('data-error-class').split(' ').forEach(errorClass => {
            input.classList.add(errorClass);
        })
    }

    console.dir(input.closest('[data-error-msg]'));
    // TODO: Terminer la selection du data-error-msg
    if( input.parentElement.closest('[data-error-msg]') ){
        console.log('data-error-msg')
        console.log(input.closest('[data-error-msg]'))
    }

}