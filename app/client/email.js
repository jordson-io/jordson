async function sendEmail( form ){

    // TODO: Terminer la vérification des champs avant envoi de l'email

    console.log('send email function')
    let formData = new FormData(form)

    console.log(Array.from(formData.entries()))

    let hnpt1 = formData.get('hnpt1') === "Robert";
    let hnpt2 = formData.get('hnpt2') === "";
    let hnpt3 = formData.get('hnpt3') === "chemin des ours";
    let hnpt4 = formData.get('hnpt4') === "";
    let rgpd = formData.get('rgpd');

    if( hnpt1 && hnpt2 && hnpt3 && hnpt4 ){

      if(!rgpd){

        console.log('ERREUR RGPD NON VALIDÉ');

      } else {

        let dataFormSorted = []

        Array.from(formData.entries()).forEach(formEntry => {
            if( !formEntry[0].startsWith('hnpt') && formEntry[0] !== 'rgpd' )
                dataFormSorted[`${formEntry[0]}`] = `${formEntry[1]}`
        });

        dataFormSorted = Object.assign({}, dataFormSorted)

        let resp = await fetch('/api?action=emailsend', {
            method: "POST",
            body: JSON.stringify(dataFormSorted)
        });

        //TODO: Traiter la réponse du serveur
        console.log(await resp.json())


        let formDataJson = {
            "email" : "monemail@email.com",
            "message" : "Mon message complet et bien structuré"
        }

      }

    }

}
