
function checkFormRules(form){

    checkRequired(form);

}

function checkRequired(form){

    form.querySelectorAll('input').forEach( input => {
        console.log(input)
    })

}
