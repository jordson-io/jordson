function sendEmail( form ){

    // TODO: Terminer la vérification avant envoi de l'email

    console.log('send email function')
    let formData = new FormData(form)
    console.log(Array.from(formData.entries()))

    let data1 = formData.get('data1') === "Robert";
    let data2 = formData.get('data2') === "";
    let data3 = formData.get('data3') === "chemin des ours";
    let data4 = formData.get('data4') === "";
    let rgpd = formData.get('rgpd') === 'on';

    if(!rgpd){
        console.log('ERREUR RGPD NON COCHÉ')
    }

    console.log(data1)
    console.log(data2)
    console.log(data3)
    console.log(data4)
    console.log(rgpd)

}