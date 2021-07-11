/**
 * Check Form Rules
 * @function
 * @param {object} [form]
 */
function checkFormRules(form:HTMLFormElement | null){
    if(form){
        cleanInputsError(form);

        if(honeypot(form) && checkRequired(form) && checkType(form) && checkRules(form)){
            formActions(form);
        }
    }
}

/**
 * Check honeypot fields
 * @function
 * @param {object} [form]
 * @returns {boolean}
 */
function honeypot(form:HTMLFormElement): boolean{
    let status:boolean = true;

    form.querySelectorAll('[data-hnpt]').forEach((honeypot: HTMLInputElement) => {
        if(honeypot.value !== honeypot.getAttribute('data-hnpt')){
            status = false
            showNotification("Veuillez contacter l'administrateur du site", 'error', 'Une erreur est survenue !');
        }
    });

    return status
}

/**
 * Check "required" fields
 * @function
 * @param {object} [form]
 * @returns {boolean}
 */
function checkRequired(form:HTMLFormElement): boolean{
    let status:boolean = true;

    form.querySelectorAll('input').forEach( (input: HTMLInputElement) => {
        if(!input.hasAttribute('data-hnpt') && input.required && ((input.type === 'checkbox' && !input.checked) || !input.value)){
            callFormError(input, 'required');
            status = false;
        }
    })

    form.querySelectorAll('textarea').forEach( (textarea: HTMLTextAreaElement) => {
        if(!textarea.hasAttribute('data-hnpt') && textarea.required && !textarea.value.trim()){
            callFormError(textarea, 'required');
            status = false
        }
    })

    return status
}

/**
 * Check specific "type" of fields
 * @function
 * @param {object} [form]
 * @returns {boolean}
 */
function checkType(form: HTMLFormElement): boolean{
    let status: boolean = true;

    form.querySelectorAll('input').forEach((input: HTMLInputElement) => {
        if(input.type === 'email'){
            input.value = input.value.trim();
            const regex:RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
            if(!input.value.match(regex)){
                callFormError(input, 'typeEmail')
                status = false;
            }
        }
    })

    return status
}

/**
 * Check specific "rules" (data-rules attributes)
 * @function
 * @param {object} [form]
 * @returns {boolean}
 */
function checkRules(form: HTMLFormElement): boolean{
    let status: boolean = true;

    //

    return status
}