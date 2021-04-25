
/**
 * Checks the integrity of the HTML with the server
 * @function
 * @param {string} [form] Pass an innerHTML or an outerHTML
 * @returns {Promise<string>} Returns True or False as a string
 */
async function checkFormIntegrity(form){

    // console.log(form.split(' ').join('')
    //     .replace('/>', '>')
    //     .replace(/\n/g, '')
    //     .replace(/\b/g, '')
    //     .replace(/\f/g, '')
    //     .replace(/\r/g, '')
    //     .replace(/\v/g, '')
    //     .replace(/\s/g, '')
    //     .replace(/\t/g, '')
    //     .replace(/\\/g, '')
    //     .replace(/=""/g, ''))

    let resp = await fetch('/api?action=cfi', {
        method: "POST",
        body: JSON.stringify({
            dataId: document.location.pathname.replace('/', ''),
            hashForm: sha256(form.split(' ').join('')
                .replace('/>', '>')
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

    return await resp.json();
}
