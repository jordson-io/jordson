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
 * Check Form Rules
 * @function
 * @param {object} [form]
 */
function checkFormRules(form){
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
function honeypot(form){
    let status = true;

    form.querySelectorAll('[data-hnpt]').forEach((honeypot) => {
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
function checkRequired(form){
    let status = true;

    form.querySelectorAll('input').forEach( (input) => {
        if(!input.hasAttribute('data-hnpt') && input.required && ((input.type === 'checkbox' && !input.checked) || !input.value)){
            callFormError(input, 'required');
            status = false;
        }
    })

    form.querySelectorAll('textarea').forEach( (textarea) => {
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
function checkType(form){
    let status = true;

    form.querySelectorAll('input').forEach((input) => {
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

/**
 * Check specific "rules" (data-rules attributes)
 * @function
 * @param {object} [form]
 * @returns {boolean}
 */
function checkRules(form){
    let status = true;

    //

    return status
}