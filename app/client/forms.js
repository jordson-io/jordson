
function setCFIListeners(){
    document.querySelectorAll('[data-cfi]').forEach(target => {
        target.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            checkFormIntegrity(target.closest('form').outerHTML)
        })
    });
}

async function checkFormIntegrity(form){

    console.log(await digestMessage(form))
    let resp = await fetch('/api?action=cfi', {
        method: "POST",
        body: JSON.stringify({
            dataId: document.location.pathname.replace('/', ''),
            hashForm: await digestMessage(form),
        })
    });
    console.log(resp);
}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}