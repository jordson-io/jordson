/** Copyright © 2021 André LECLERCQ
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 **/


/**
 * MANAGE NOTIFICATIONS
 * @link Read Documentation https://github.com/AndreLeclercq/jordson/blob/v0.1/doc/notifications.md
 */

/**
 * Load Notifications into index.html
 * @function
 */
function loadNotifications(){
    htmlData.querySelectorAll('[data-id]').forEach( (element) => {
        if( element.getAttribute('data-id').endsWith('.notif')){

            let name = element.getAttribute('data-id').replace(/.notif/g, '');
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
function showNotification( message = "", type = 'default', title = "default", autoHide = true ){

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

    let notification = document.querySelector(`[data-notification="${type}"]`)
    if(notification){
        (notification.querySelector('[data-title]')).innerText = dataTitle;
        (notification.querySelector('[data-message]')).innerText = message;
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
function hideNotification( type = 'default' ){
    document.querySelector(`[data-notification="${type}"]`).classList.remove('fade-in');
    document.querySelector(`[data-notification="${type}"]`).classList.add('fade-out');
}
