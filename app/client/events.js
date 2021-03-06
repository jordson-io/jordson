/**
 * Manage ALL click events
 * Do not add new elements in this Function, use "customEvents" to add new click event matches
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
   * Manage Custom Events
   */
  customEvents(e);
});

/**
 * Manage Custom Events
 * @param e Event from eventListenner
 */
function customEvents(e) {

  if(e.target.hasAttribute('data-action')){

    if( e.target.getAttribute('data-action') === 'sendEmail' ){
      e.preventDefault();
      sendEmail(e.target.closest('form'))
    }

  }

}
