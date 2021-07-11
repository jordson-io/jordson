/**
 * Errors messages clean-up
 * @function
 * @param {object} [form]
 */
function cleanInputsError(form: HTMLFormElement){

    form.querySelectorAll('input').forEach( (input: HTMLInputElement) => {
        if( input.hasAttribute('data-error-class') ){
            input.getAttribute('data-error-class').split(/ /g).forEach((errorClass: string) => {
                input.classList.remove(errorClass);
            })
        }
        cleanTextContent(input.id);
    })

    form.querySelectorAll('textarea').forEach( (textarea: HTMLTextAreaElement) => {
        if( textarea.hasAttribute('data-error-class') ){
            textarea.getAttribute('data-error-class').split(/ /g).forEach((errorClass: string) => {
                textarea.classList.remove(errorClass);
            })
        }
        cleanTextContent(textarea.id);
    })

    function cleanTextContent(elementId: string) {
        let errorMsg:HTMLElement | null = document.querySelector(`[data-error-for="${elementId}"]`)
        errorMsg?.textContent = '';
    }

}

/**
 * Display errors messages
 * @function
 * @param {HTMLInputElement | HTMLTextAreaElement} [input]
 * @param {string} [type]
 * @param {string} [message]
 */
function callFormError(input: HTMLInputElement | HTMLTextAreaElement, type: string, message: string = ''){
    let errorMessage: string | null;
    let notifMessage: string | null;

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

    if(message !== '')
        errorMessage = message

    showNotification(notifMessage || '', 'error', 'Erreur sur le formulaire');

    if( input.hasAttribute('data-error-class') ){
        input.getAttribute('data-error-class').split(/ /g).forEach((errorClass: string) => {
            input.classList.add(errorClass);
        })
    }

    document.querySelector(`[data-error-for="${input.id}"]`).textContent = errorMessage;
}