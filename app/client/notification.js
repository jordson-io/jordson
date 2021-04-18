/**
 * MANAGE NOTIFICATIONS
 * @link Read Documentation https://github.com/AndreLeclercq/jordson/blob/v0.1/doc/notifications.md
 */

/**
 * Load Notifications into index.html
 * @function
 */
function loadNotifications(){
    htmlData.querySelectorAll('[data-id]').forEach( element => {
        if( element.getAttribute('data-id').endsWith('.notif')){
            let name = element.getAttribute('data-id').replace('.notif', '');
            let notification = document.createElement('div');
            notification.innerHTML = htmlData.querySelector(`[data-id="${name}.notif"]`).innerHTML;
            notification.setAttribute('data-notification', name);
            notification.classList.add('fade-out');
            document.body.appendChild(notification);
        }
    })
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
    } else {
        dataTitle = title;
    }

    let notif = document.querySelector(`[data-notification="${type}"]`)
    notif.querySelector('[data-title]').innerText = dataTitle;
    notif.querySelector('[data-message]').innerText = message;
    notif.classList.remove('fade-out');
    notif.classList.add('fade-in');

    if( autoHide ) setTimeout( () => hideNotification(type), 5000 );

}

/**
 * Hide notification
 * @function
 * @param {string} [type] Leave empty (or 'default') for default display or choose between 'info', 'success', 'warning', 'error'.
 * @example hideNotification('success');
 */
function hideNotification( type = 'default' ){

    document.querySelector(`[data-notification="${type}"]`).classList.remove('fade-in');
    document.querySelector(`[data-notification="${type}"]`).classList.add('fade-out');

}