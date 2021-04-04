/**
 * Manage ALL click events
 * Do not add new elements in this Function, use "customClickEvents" to add new click event matches
 */
document.addEventListener("click", (e) => {

  /**
   * Manage internal Links
   * Link like "/my-link" doesn't reload page, just the body content.
   */
  if (
    e.target.closest("A") &&
    e.target.closest("A").hostname === location.hostname &&
    !e.target.closest("A").href.includes("#")
  ) {
    e.preventDefault();
    document.location.href = e.target.closest("A").pathname.replace("/", "#");
  }

  /**
   * Manage Anchors
   * Create link with this attribute : data-anchor="targetId" (replace targetId by the element ID was targeting)
   */
  if (e.target.matches("[data-anchor]")) {
    e.preventDefault();
    document
      .getElementById(e.target.closest("[data-anchor]").attributes["data-anchor"].value)
      .scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Manage Notifications
   */
  if( e.target.closest("[data-notification]")){
    hideNotification(e.target.closest("[data-notification]").attributes["data-notification"].value)
  }

  /**
   * Manage Data-Actions
   * Management of scripts triggered by "data-action" html tags
   */
  if(e.target.hasAttribute('data-action')){

    /**
     * Send Mail
     * Sending an email from a form
     */
    if( e.target.getAttribute('data-action') === 'sendEmail' ){

      e.preventDefault();

      let to = e.target.hasAttribute('data-to') ? e.target.getAttribute('data-to') : null;
      let from = e.target.hasAttribute('data-from') ? e.target.getAttribute('data-from') : null;
      let subject = e.target.hasAttribute('data-subject') ? e.target.getAttribute('data-subject') : null;
      let honeypots = e.target.closest('form').querySelectorAll('[data-hnpt]').length !== 0
          ? e.target.closest('form').querySelectorAll('[data-hnpt]')
          : null;

      sendEmail(e.target.closest('form'), from, to, subject, honeypots);

    }

  }

  /**
   * Manage Custom Events
   */
  customClickEvents(e);
});

document.addEventListener('dbReady', () => {
  loadNotifications()
})

/**
 * Manage Custom Events
 * @param e Event from eventListenner
 */
function customClickEvents(e) {

}
