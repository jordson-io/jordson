
function setCFIListeners(){
    document.querySelectorAll('[data-cfi]').forEach(target => {
        target.addEventListener('click', async e => {
            e.preventDefault();
            e.stopPropagation();
            if(await checkFormIntegrity(target.closest('form').outerHTML)){
                console.log('CFI IS OK !')
                // TODO: Send form
            }
        })
    })
}

async function checkFormIntegrity(form){

    let resp = await fetch('/api?action=cfi', {
        method: "POST",
        body: JSON.stringify({
            dataId: document.location.pathname.replace('/', ''),
            hashForm: sha256(form.split(' ').join('')
                .replace(/\n/g, '')
                .replace(/\b/g, '')
                .replace(/\f/g, '')
                .replace(/\r/g, '')
                .replace(/\v/g, '')
                .replace(/\s/g, '')
                .replace(/\t/g, '')
                .replace(/\\/g, '')
                .replace(/=""/g, '')),
        })
    })

    return await resp.text();
}
