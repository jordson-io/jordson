
function loadNotifications(){

    // TODO: Créer une boucle pour charger toutes les notifications

    let successNotification = document.createElement('div');
    successNotification.innerHTML = htmlData.querySelector('[data-id="notif_success"]').innerHTML;
    successNotification.setAttribute('data-notification', 'success');
    successNotification.classList.add('fade-out');
    document.body.appendChild(successNotification);

    let infoNotification = document.createElement('div');
    infoNotification.innerHTML = htmlData.querySelector('[data-id="notif_info"]').innerHTML;
    infoNotification.setAttribute('data-notification', 'info');
    infoNotification.classList.add('fade-out');
    document.body.appendChild(infoNotification);

    let warningNotification = document.createElement('div');
    warningNotification.innerHTML = htmlData.querySelector('[data-id="notif_warning"]').innerHTML;
    warningNotification.setAttribute('data-notification', 'warning');
    warningNotification.classList.add('fade-out');
    document.body.appendChild(warningNotification);

    let errorNotification = document.createElement('div');
    errorNotification.innerHTML = htmlData.querySelector('[data-id="notif_error"]').innerHTML;
    errorNotification.setAttribute('data-notification', 'error');
    errorNotification.classList.add('fade-out');
    document.body.appendChild(errorNotification);

    let defaultNotification = document.createElement('div');
    defaultNotification.innerHTML = htmlData.querySelector('[data-id="notif_default"]').innerHTML;
    defaultNotification.setAttribute('data-notification', 'default');
    defaultNotification.classList.add('fade-out');
    document.body.appendChild(defaultNotification);

}

/**
 * Show Notifications
 * @function
 * @param {string} [message] Write the message to be displayed.
 * @param {string} [type] Leave empty (or 'default') for default display or choose between 'info', 'success', 'warning', 'error'.
 * @param {string} [title] Leave empty (or 'default') for default display.
 * @param {boolean} [autoHide] True by default, hide notification after 5 seconds.
 * @example showNotification("Message sent successfully !", "success");
 */
function showNotification( message = "", type= 'default', title = "default", autoHide = true ){

    let dataTitle = '';

    if(title === 'default'){
        switch (type) {
            case "success":
                dataTitle = 'Succès';
                break;
            case "info":
                dataTitle = 'Info';
                break;
            case "warning":
                dataTitle = 'Attention';
                break;
            case "error":
                dataTitle = "Erreur";
                break;
        }
    }

    let notif = document.querySelector(`[data-notification="${type}"]`)
    notif.querySelector('[data-title]').innerText = dataTitle;
    notif.querySelector('[data-content]').innerText = message;
    notif.classList.remove('fade-out');
    notif.classList.add('fade-in');

    if( autoHide ) setTimeout( () => hideNotification(type), 5000 );

}

function hideNotification( type ){

    document.querySelector(`[data-notification="${type}"]`).classList.remove('fade-in');
    document.querySelector(`[data-notification="${type}"]`).classList.add('fade-out');

}