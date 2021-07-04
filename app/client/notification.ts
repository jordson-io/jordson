/**
 * MANAGE NOTIFICATIONS
 * @link Read Documentation https://github.com/AndreLeclercq/jordson/blob/v0.1/doc/notifications.md
 */

/**
 * Load Notifications into index.html
 * @function
 */
function loadNotifications(){
    htmlData.querySelectorAll('[data-id]').forEach( (element: HTMLElement) => {
        if( element.getAttribute('data-id').endsWith('.notif')){

            let name:string = element.getAttribute('data-id').replace(/.notif/g, '');
            let notification:HTMLElement = document.createElement('div');

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
function showNotification( message: string = "", type: string= 'default', title: string = "default", autoHide: boolean = true ){

    let dataTitle:string = '';

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

    let notification:HTMLElement | null = document.querySelector(`[data-notification="${type}"]`)
    if(notification){
        (<HTMLElement>notification.querySelector('[data-title]')).innerText = dataTitle;
        (<HTMLElement>notification.querySelector('[data-message]')).innerText = message;
    }

    notification?.classList.remove('fade-out');
    notification?.classList.add('fade-in');

    if(autoHide) setTimeout( () => hideNotification(type), 5000 );
}

/**
 * Hide notification
 * @function
 * @param {string} [type] Leave empty (or 'default') for default display or choose between 'info', 'success', 'warning', 'error'.
 * @example hideNotification('success');
 */
function hideNotification( type: string = 'default' ){
    document.querySelector(`[data-notification="${type}"]`).classList.remove('fade-in');
    document.querySelector(`[data-notification="${type}"]`).classList.add('fade-out');
}
