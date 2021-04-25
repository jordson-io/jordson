
function checkFormRules(form){

    checkRequired(form);

}

function checkRequired(form){

    form.querySelectorAll('input').forEach( input => {
        if(!input.hasAttribute('data-hnpt') && input.required && input.value === ''){
            callFormError(input, 'required');
        }
    })

}
