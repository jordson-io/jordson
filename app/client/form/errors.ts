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