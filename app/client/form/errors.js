
function cleanInputsError(form){

    form.querySelectorAll('input').forEach( input => {
        if( input.hasAttribute('data-error-class') ){
            input.getAttribute('data-error-class').split(' ').forEach(errorClass => {
                input.classList.remove(errorClass);
            })
        }
        let errorMsg = document.querySelector(`[data-error-for="${input.id}"]`)
        if(errorMsg) errorMsg.textContent = '';
    })

    form.querySelectorAll('textarea').forEach( textarea => {
        if( textarea.hasAttribute('data-error-class') ){
            textarea.getAttribute('data-error-class').split(' ').forEach(errorClass => {
                textarea.classList.remove(errorClass);
            })
        }
        let errorMsg = document.querySelector(`[data-error-for="${textarea.id}"]`)
        if(errorMsg) errorMsg.textContent = '';
    })


}

function callFormError(input, type, message = null){

    let errorMessage;
    let notifMessage;

    switch (type) {

        case 'required':
            errorMessage = 'Ce champ est requis, merci de le remplir';
            notifMessage = 'Un ou plusieurs champ(s) requis invalide(s)';
            break;

        case 'typeEmail':
            errorMessage = 'Email incorrect';
            notifMessage = 'Un ou plusieurs champ(s) sont invalide(s)';
            break;

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

    document.querySelector(`[data-error-for="${input.id}"]`).textContent = errorMessage;
}